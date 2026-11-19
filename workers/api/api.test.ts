import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { handle } from './index';
import { inboxPage, subscriberPage } from './notion';

const env = {
  NOTION_TOKEN: 'secret',
  NOTION_SUBSCRIBERS_DATA_SOURCE_ID: 'sub-id',
  NOTION_INBOX_DATA_SOURCE_ID: 'inbox-id',
};

function post(path: string, body: unknown, ip = '203.0.113.10') {
  return new Request(`https://thechaithanya.com${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://thechaithanya.com',
      'CF-Connecting-IP': ip,
    },
    body: JSON.stringify(body),
  });
}

describe('worker api', () => {
  it('builds a Subscribers page for a new email', () => {
    const page = subscriberPage('sub-id', {
      email: 'a@example.com',
      firstName: 'Asha',
      source: 'newsletter',
      tag: '',
    });
    assert.deepEqual(page.parent, { type: 'data_source_id', data_source_id: 'sub-id' });
    assert.equal(page.properties.Status.select.name, 'Active');
    assert.equal('Tag' in page.properties, false);
  });

  it('omits Email when an idea has none', () => {
    const page = inboxPage('inbox-id', {
      name: 'Idea',
      email: '',
      reason: 'Suggest an experiment',
      message: 'Try a 24 hour build.',
    });
    assert.equal('Email' in page.properties, false);
    assert.equal(page.properties.Reason.select.name, 'Suggest an experiment');
  });

  it('accepts a new subscriber and skips a duplicate', async () => {
    const calls: string[] = [];
    const store = new Map<string, number[]>();
    const fetchImpl: typeof fetch = async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      calls.push(body.parent ? 'create' : 'query');
      if (!body.parent) return Response.json({ results: calls.includes('create') ? [{ id: '1' }] : [] });
      return Response.json({ id: 'page' });
    };

    const first = await handle(post('/api/subscribe', { email: 'a@example.com', source: 'home' }), env, { store, fetch: fetchImpl });
    const second = await handle(post('/api/subscribe', { email: 'a@example.com', source: 'home' }), env, { store, fetch: fetchImpl });
    assert.equal((await first.json()).ok, true);
    assert.equal((await second.json()).ok, true);
    assert.deepEqual(calls, ['query', 'create', 'query']);
  });

  it('stores an idea without an email', async () => {
    const saved: { body: { parent?: { data_source_id?: string } } | null } = { body: null };
    const fetchImpl: typeof fetch = async (_input, init) => {
      saved.body = JSON.parse(String(init?.body));
      return Response.json({ id: 'page' });
    };
    const response = await handle(
      post('/api/contact', { name: 'Idea', email: '', reason: 'Suggest an experiment', message: 'Build an app in a day' }, '203.0.113.11'),
      env,
      { store: new Map(), fetch: fetchImpl },
    );
    assert.equal(response.status, 200);
    assert.equal(saved.body?.parent?.data_source_id, 'inbox-id');
  });

  it('returns success for a filled honeypot and does not call Notion', async () => {
    let called = false;
    const response = await handle(
      post('/api/contact', { name: 'Bot', email: 'bot@example.com', reason: 'Just saying hi', message: 'hello there friend', website: 'spam' }, '203.0.113.12'),
      env,
      {
        store: new Map(),
        fetch: async () => {
          called = true;
          return Response.json({});
        },
      },
    );
    assert.equal(response.status, 200);
    assert.equal(called, false);
  });

  it('blocks a sixth request from the same IP', async () => {
    const store = new Map<string, number[]>();
    const fetchImpl: typeof fetch = async () => Response.json({ results: [] });
    let status = 0;
    for (let i = 0; i < 6; i += 1) {
      const response = await handle(post('/api/subscribe', { email: 'bad', source: 'nope' }, '203.0.113.13'), env, { store, fetch: fetchImpl });
      status = response.status;
    }
    assert.equal(status, 429);
  });

  it('allows the local site to call a local worker', async () => {
    const request = new Request('https://thechaithanya.com/api/subscribe', {
      method: 'POST',
      headers: {
        Origin: 'http://127.0.0.1:3456',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'a@example.com', source: 'home' }),
    });
    const response = await handle(request, { ...env, NOTION_TOKEN: '' }, { store: new Map() });
    assert.equal(response.status, 500);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'http://127.0.0.1:3456');
  });

  it('rejects a foreign origin', async () => {
    const request = new Request('https://thechaithanya.com/api/contact', {
      method: 'POST',
      headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' },
      body: '{}',
    });
    const response = await handle(request, env, { store: new Map() });
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  });
});
