/**
 * Instant publishing: Notion calls this endpoint whenever a page the
 * integration can see changes, and we ask GitHub to run the Deploy workflow.
 * The workflow rebuilds from Notion and only deploys when published content
 * actually changed, so edits to drafts cost a build but never a deploy.
 */

export type PublishEnv = {
  /** The verification_token Notion sends once when the subscription is created. */
  NOTION_WEBHOOK_SECRET?: string;
  /** Fine-grained GitHub token with Actions: read and write on GITHUB_REPO. */
  GITHUB_DEPLOY_TOKEN?: string;
  /** owner/name of the repository whose Deploy workflow should run. */
  GITHUB_REPO?: string;
  /** Optional comma-separated Notion database / data source ids to react to. */
  NOTION_BLOG_PARENT_IDS?: string;
  /** Form databases: new signups and messages never change the blog. */
  NOTION_SUBSCRIBERS_DATA_SOURCE_ID?: string;
  NOTION_INBOX_DATA_SOURCE_ID?: string;
};

const MAX_BODY = 100_000;

function reply(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' },
  });
}

const plainId = (id: unknown) => (typeof id === 'string' ? id.replace(/-/g, '').toLowerCase() : '');

async function sign(secret: string, body: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return `sha256=${[...new Uint8Array(mac)].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

/** Compare without leaking how many leading characters matched. */
function sameText(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

type NotionEvent = {
  verification_token?: string;
  type?: string;
  data?: { parent?: { id?: string; data_source_id?: string } };
};

/** Which events can change what the blog shows. */
function relevant(event: NotionEvent, env: PublishEnv) {
  const type = event.type ?? '';
  if (!/^(page|database|data_source)\./.test(type)) return false;

  const parent = event.data?.parent;
  const ids = [parent?.id, parent?.data_source_id].map(plainId).filter(Boolean);
  const forms = [env.NOTION_SUBSCRIBERS_DATA_SOURCE_ID, env.NOTION_INBOX_DATA_SOURCE_ID].map(plainId).filter(Boolean);
  if (ids.some((id) => forms.includes(id))) return false;

  const allowed = (env.NOTION_BLOG_PARENT_IDS ?? '').split(',').map(plainId).filter(Boolean);
  if (allowed.length === 0) return true;
  // No parent in the payload (e.g. a schema change): rebuild rather than miss it.
  return ids.length === 0 || ids.some((id) => allowed.includes(id));
}

export async function notionWebhook(request: Request, env: PublishEnv, fetchImpl: typeof fetch = fetch) {
  if (request.method !== 'POST') return reply(405, { ok: false, error: 'Use POST.' });

  const body = await request.text();
  if (body.length > MAX_BODY) return reply(413, { ok: false, error: 'Too large.' });

  let event: NotionEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return reply(400, { ok: false, error: 'Send a JSON body.' });
  }

  // One-time handshake: Notion posts a token that has to be pasted back into
  // Notion, and that same token then signs every event.
  if (typeof event.verification_token === 'string' && !event.type) {
    console.log(`Notion webhook verification_token: ${event.verification_token}`);
    return reply(200, { ok: true });
  }

  if (!env.NOTION_WEBHOOK_SECRET) return reply(503, { ok: false, error: 'Webhook secret not set.' });
  const expected = await sign(env.NOTION_WEBHOOK_SECRET, body);
  if (!sameText(request.headers.get('X-Notion-Signature') ?? '', expected)) {
    return reply(401, { ok: false, error: 'Bad signature.' });
  }

  if (!relevant(event, env)) return reply(200, { ok: true, deploy: false });

  if (!env.GITHUB_DEPLOY_TOKEN || !env.GITHUB_REPO) return reply(503, { ok: false, error: 'GitHub not configured.' });

  const response = await fetchImpl(
    `https://api.github.com/repos/${env.GITHUB_REPO}/actions/workflows/deploy.yml/dispatches`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${env.GITHUB_DEPLOY_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'thechaithanya-publisher',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ ref: 'main', inputs: { source: 'notion' } }),
    },
  );

  if (!response.ok) {
    console.error(`GitHub dispatch failed: ${response.status} ${await response.text()}`);
    // A non-2xx makes Notion retry the delivery later.
    return reply(502, { ok: false, error: 'Could not start the deploy.' });
  }
  return reply(202, { ok: true, deploy: true });
}
