import { createPage, emailExists, inboxPage, subscriberPage, type NotionEnv } from './notion';
import { isHoneypot, readContact, readSubscribe } from './validate';

export type Env = NotionEnv;

const SITE = 'https://thechaithanya.com';
const HOUR = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function allowedOrigin(request: Request) {
  const origin = request.headers.get('Origin');
  if (!origin) return null;
  if (origin === SITE) return origin;
  // A browser only sends a localhost Origin from a page it actually loaded there.
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return origin;
  return null;
}

function json(body: { ok: boolean; error?: string }, status: number, origin: string | null) {
  const headers = new Headers({ 'Content-Type': 'application/json', ...securityHeaders });
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function limited(ip: string, now: number, store: Map<string, number[]>) {
  const recent = (store.get(ip) ?? []).filter((time) => now - time < HOUR);
  if (recent.length >= 5) {
    store.set(ip, recent);
    return true;
  }
  recent.push(now);
  store.set(ip, recent);
  return false;
}

function configured(env: Env, key: 'NOTION_SUBSCRIBERS_DATA_SOURCE_ID' | 'NOTION_INBOX_DATA_SOURCE_ID') {
  return Boolean(env.NOTION_TOKEN && env[key]);
}

export async function handle(
  request: Request,
  env: Env,
  options: { now?: number; store?: Map<string, number[]>; fetch?: typeof fetch } = {},
) {
  const url = new URL(request.url);
  const origin = allowedOrigin(request);
  if (request.headers.has('Origin') && !origin) return json({ ok: false, error: 'Origin not allowed.' }, 403, null);

  if (request.method === 'OPTIONS') {
    const headers = new Headers(securityHeaders);
    if (origin) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
      headers.set('Vary', 'Origin');
    }
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== 'POST') return json({ ok: false, error: 'Use POST.' }, 405, origin);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (limited(ip, options.now ?? Date.now(), options.store ?? hits)) {
    return json({ ok: false, error: 'Too many attempts. Try again in an hour.' }, 429, origin);
  }

  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > 20_000) return json({ ok: false, error: 'Message is too long.' }, 413, origin);

  // The header can be missing or wrong (chunked uploads), so check the real size too.
  const text = await request.text();
  if (text.length > 20_000) return json({ ok: false, error: 'Message is too long.' }, 413, origin);

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ ok: false, error: 'Send a JSON body.' }, 400, origin);
  }

  if (isHoneypot(body)) return json({ ok: true }, 200, origin);

  const fetchImpl = options.fetch ?? fetch;

  try {
    if (url.pathname === '/api/subscribe') {
      if (!configured(env, 'NOTION_SUBSCRIBERS_DATA_SOURCE_ID')) return json({ ok: false, error: 'Not configured.' }, 500, origin);
      const input = readSubscribe(body);
      if (!input.ok) return json(input, 400, origin);
      if (await emailExists(env, input.value.email, fetchImpl)) return json({ ok: true }, 200, origin);
      await createPage(env, subscriberPage(env.NOTION_SUBSCRIBERS_DATA_SOURCE_ID ?? '', input.value), fetchImpl);
      return json({ ok: true }, 200, origin);
    }

    if (url.pathname === '/api/contact') {
      if (!configured(env, 'NOTION_INBOX_DATA_SOURCE_ID')) return json({ ok: false, error: 'Not configured.' }, 500, origin);
      const input = readContact(body);
      if (!input.ok) return json(input, 400, origin);
      await createPage(env, inboxPage(env.NOTION_INBOX_DATA_SOURCE_ID ?? '', input.value), fetchImpl);
      return json({ ok: true }, 200, origin);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return json({ ok: false, error: "That didn't work. Try again in a minute." }, 502, origin);
  }

  return json({ ok: false, error: 'Not found.' }, 404, origin);
}

export default {
  fetch(request: Request, env: Env) {
    return handle(request, env);
  },
};
