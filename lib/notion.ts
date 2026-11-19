import { APIResponseError, Client, isNotionClientError } from '@notionhq/client';

const GAP_MS = 340;

export type RichText = {
  text: string;
  href?: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
};

export type NotionPage = {
  id: string;
  url: string;
  lastEdited: string;
  properties: Record<string, NotionProperty>;
  coverUrl: string;
};

export type NotionProperty = {
  type?: string;
  title?: RichSource[];
  rich_text?: RichSource[];
  select?: { name?: string } | null;
  multi_select?: Array<{ name?: string }>;
  date?: { start?: string | null } | null;
  url?: string | null;
  number?: number | null;
  checkbox?: boolean;
  files?: NotionFile[];
};

type RichSource = {
  plain_text?: string;
  href?: string | null;
  text?: { link?: { url?: string | null } | null };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
  };
};

type NotionFile = {
  name?: string;
  file?: { url?: string };
  external?: { url?: string };
};

export type RawBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  [key: string]: unknown;
};

let queue: Promise<void> = Promise.resolve();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function headerValue(headers: unknown, name: string) {
  if (!headers || typeof headers !== 'object' || !('get' in headers) || typeof headers.get !== 'function') return undefined;
  const value = (headers.get as (key: string) => unknown)(name);
  return typeof value === 'string' ? value : undefined;
}

function retryDelay(error: unknown, attempt: number) {
  if (error instanceof APIResponseError && error.status === 429) {
    const header = headerValue(error.headers, 'retry-after');
    const seconds = Number(header);
    if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000;
    return 1000 * (attempt + 1);
  }
  return 0;
}

async function withRetry<T>(run: () => Promise<T>, attempt = 0): Promise<T> {
  try {
    return await run();
  } catch (error) {
    const delay = retryDelay(error, attempt);
    if (delay > 0 && attempt < 5) {
      await sleep(delay);
      return withRetry(run, attempt + 1);
    }
    if (isNotionClientError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
}

export function limit<T>(run: () => Promise<T>): Promise<T> {
  const result = queue.then(async () => {
    await sleep(GAP_MS);
    return withRetry(run);
  });
  queue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

export function createNotion(auth: string) {
  return new Client({ auth, notionVersion: '2025-09-03' });
}

export async function resolveDataSourceId(notion: Client, dataSourceId: string | undefined, databaseId: string | undefined) {
  if (dataSourceId) return dataSourceId;
  if (!databaseId) {
    throw new Error('Set NOTION_BLOG_DATA_SOURCE_ID or NOTION_BLOG_DATABASE_ID.');
  }
  const database = await limit(() => notion.databases.retrieve({ database_id: databaseId }));
  if (!('data_sources' in database) || database.data_sources.length === 0) {
    throw new Error(`Database ${databaseId} has no data source. Check the id and the Notion connection.`);
  }
  return database.data_sources[0].id;
}

export function todayInIndia() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

export async function queryPublishedPosts(notion: Client, dataSourceId: string, today: string) {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const response = await limit(() =>
      notion.dataSources.query({
        data_source_id: dataSourceId,
        page_size: 100,
        start_cursor: cursor,
        result_type: 'page',
        filter: {
          and: [
            { property: 'Status', select: { equals: 'Published' } },
            { property: 'Date', date: { on_or_before: today } },
          ],
        },
        sorts: [{ property: 'Date', direction: 'descending' }],
      }),
    );

    for (const result of response.results) {
      if (result.object !== 'page' || !('properties' in result)) continue;
      pages.push({
        id: result.id,
        url: result.url,
        lastEdited: result.last_edited_time,
        properties: result.properties as Record<string, NotionProperty>,
        coverUrl: coverUrl(result.cover),
      });
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages;
}

function coverUrl(cover: { type?: string; file?: { url?: string }; external?: { url?: string } } | null) {
  if (!cover) return '';
  if (cover.type === 'file') return cover.file?.url ?? '';
  if (cover.type === 'external') return cover.external?.url ?? '';
  return '';
}

export async function listBlocks(notion: Client, blockId: string): Promise<RawBlock[]> {
  const blocks: RawBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await limit(() =>
      notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        start_cursor: cursor,
      }),
    );
    for (const block of response.results) {
      if ('type' in block && typeof block.type === 'string') {
        blocks.push(block as RawBlock);
      }
    }
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

export function plainText(items: RichSource[] | undefined) {
  return (items ?? []).map((item) => item.plain_text ?? '').join('');
}

export function mapRichText(items: RichSource[] | undefined): RichText[] {
  return (items ?? []).flatMap((item) => {
    const text = item.plain_text ?? '';
    const href = item.href || item.text?.link?.url || undefined;
    if (!text && !href) return [];
    const marks = item.annotations ?? {};
    return [
      {
        text,
        ...(href ? { href } : {}),
        ...(marks.bold ? { bold: true } : {}),
        ...(marks.italic ? { italic: true } : {}),
        ...(marks.code ? { code: true } : {}),
        ...(marks.strikethrough ? { strikethrough: true } : {}),
        ...(marks.underline ? { underline: true } : {}),
      },
    ];
  });
}

export function propertyText(property: NotionProperty | undefined) {
  if (!property) return '';
  if (property.type === 'title') return plainText(property.title);
  if (property.type === 'rich_text') return plainText(property.rich_text);
  return plainText(property.title) || plainText(property.rich_text);
}

export function fileUrls(property: NotionProperty | undefined) {
  return (property?.files ?? [])
    .map((file) => file.file?.url || file.external?.url || '')
    .filter(Boolean);
}
