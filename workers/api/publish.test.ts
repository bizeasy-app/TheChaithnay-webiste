import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { describe, it } from 'node:test';
import { handle } from './index';

const secret = 'secret_verification_token';
const env = {
  NOTION_WEBHOOK_SECRET: secret,
  GITHUB_DEPLOY_TOKEN: 'gh-token',
  GITHUB_REPO: 'owner/repo',
  NOTION_BLOG_PARENT_IDS: 'aaaa-bbbb',
};

function hook(body: unknown, signature?: string) {
  const text = JSON.stringify(body);
  return new Request('https://thechaithanya.com/api/notion-webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Notion-Signature': signature ?? `sha256=${createHmac('sha256', secret).update(text).digest('hex')}`,
    },
    body: text,
  });
}

function recorder(status = 204) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetchImpl = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(null, { status });
  }) as unknown as typeof fetch;
  return { calls, fetchImpl };
}

const blogEdit = { type: 'page.properties_updated', data: { parent: { id: 'AAAABBBB' } } };

describe('notion webhook', () => {
  it('accepts the one-time verification handshake without a signature', async () => {
    const { calls, fetchImpl } = recorder();
    const res = await handle(hook({ verification_token: 'tok' }, ''), {}, { fetch: fetchImpl });
    assert.equal(res.status, 200);
    assert.equal(calls.length, 0);
  });

  it('rejects events with a bad signature', async () => {
    const { calls, fetchImpl } = recorder();
    const res = await handle(hook(blogEdit, 'sha256=00'), env, { fetch: fetchImpl });
    assert.equal(res.status, 401);
    assert.equal(calls.length, 0);
  });

  it('starts the Deploy workflow for a signed blog change', async () => {
    const { calls, fetchImpl } = recorder();
    const res = await handle(hook(blogEdit), env, { fetch: fetchImpl });
    assert.equal(res.status, 202);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.github.com/repos/owner/repo/actions/workflows/deploy.yml/dispatches');
    assert.deepEqual(JSON.parse(String(calls[0].init.body)), { ref: 'main', inputs: { source: 'notion' } });
  });

  it('ignores pages outside the blog database', async () => {
    const { calls, fetchImpl } = recorder();
    const res = await handle(hook({ type: 'page.created', data: { parent: { id: 'other' } } }), env, { fetch: fetchImpl });
    assert.equal(res.status, 200);
    assert.equal(calls.length, 0);
  });

  it('ignores newsletter signups landing in the subscribers database', async () => {
    const { calls, fetchImpl } = recorder();
    const formsEnv = { ...env, NOTION_BLOG_PARENT_IDS: '', NOTION_SUBSCRIBERS_DATA_SOURCE_ID: 'sub-1' };
    const signup = { type: 'page.created', data: { parent: { id: 'db-9', data_source_id: 'SUB-1' } } };
    const res = await handle(hook(signup), formsEnv, { fetch: fetchImpl });
    assert.equal(res.status, 200);
    assert.equal(calls.length, 0);
  });

  it('ignores comment events', async () => {
    const { calls, fetchImpl } = recorder();
    const res = await handle(hook({ type: 'comment.created', data: {} }), env, { fetch: fetchImpl });
    assert.equal(res.status, 200);
    assert.equal(calls.length, 0);
  });

  it('asks Notion to retry when GitHub refuses', async () => {
    const { fetchImpl } = recorder(401);
    const res = await handle(hook(blogEdit), env, { fetch: fetchImpl });
    assert.equal(res.status, 502);
  });
});
