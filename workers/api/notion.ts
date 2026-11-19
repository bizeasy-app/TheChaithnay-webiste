import type { ContactInput, SubscribeInput } from './validate';

const NOTION = 'https://api.notion.com/v1';

export type NotionEnv = {
  NOTION_TOKEN?: string;
  NOTION_SUBSCRIBERS_DATA_SOURCE_ID?: string;
  NOTION_INBOX_DATA_SOURCE_ID?: string;
};

function richText(content: string) {
  return content ? [{ text: { content } }] : [];
}

export function subscriberPage(dataSourceId: string, input: SubscribeInput) {
  return {
    parent: { type: 'data_source_id', data_source_id: dataSourceId },
    properties: {
      Email: { title: [{ text: { content: input.email } }] },
      'First name': { rich_text: richText(input.firstName) },
      Source: { select: { name: input.source } },
      ...(input.tag ? { Tag: { multi_select: [{ name: input.tag }] } } : {}),
      Status: { select: { name: 'Active' } },
    },
  };
}

export function inboxPage(dataSourceId: string, input: ContactInput) {
  return {
    parent: { type: 'data_source_id', data_source_id: dataSourceId },
    properties: {
      Name: { title: [{ text: { content: input.name } }] },
      ...(input.email ? { Email: { email: input.email } } : {}),
      Reason: { select: { name: input.reason } },
      Message: { rich_text: [{ text: { content: input.message } }] },
      Status: { select: { name: 'New' } },
    },
  };
}

export async function notionFetch(env: NotionEnv, path: string, body: unknown, fetchImpl: typeof fetch = fetch) {
  const response = await fetchImpl(`${NOTION}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN ?? ''}`,
      'Notion-Version': '2025-09-03',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response;
}

export async function emailExists(env: NotionEnv, email: string, fetchImpl: typeof fetch) {
  const id = env.NOTION_SUBSCRIBERS_DATA_SOURCE_ID ?? '';
  const response = await notionFetch(
    env,
    `/data_sources/${id}/query`,
    {
      page_size: 1,
      filter: { property: 'Email', title: { equals: email } },
    },
    fetchImpl,
  );
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Notion query failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  const data = (await response.json()) as { results?: unknown[] };
  return (data.results ?? []).length > 0;
}

export async function createPage(env: NotionEnv, body: unknown, fetchImpl: typeof fetch) {
  const response = await notionFetch(env, '/pages', body, fetchImpl);
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Notion create failed (${response.status}): ${detail.slice(0, 300)}`);
  }
}
