import fs from 'fs';
import path from 'path';
import type { Client } from '@notionhq/client';
import {
  createNotion,
  fileUrls,
  listBlocks,
  mapRichText,
  propertyText,
  queryPublishedPosts,
  resolveDataSourceId,
  todayInIndia,
  type NotionPage,
  type RawBlock,
  type RichText,
} from '../lib/notion';
import type { Post, PostBlock } from '../lib/posts';
import { webpSources, writeWebpPair } from '../lib/images';
import { readingMinutes } from '../lib/readingTime';
import { slugify } from '../lib/slug';

const SUPPORTED = new Set([
  'paragraph',
  'heading_1',
  'heading_2',
  'heading_3',
  'bulleted_list_item',
  'numbered_list_item',
  'to_do',
  'quote',
  'callout',
  'code',
  'image',
  'divider',
  'toggle',
  'bookmark',
  'embed',
  'video',
  'table',
]);

const PASS_THROUGH = new Set(['column_list', 'column', 'synced_block']);

function loadEnv() {
  for (const file of ['.env', '.env.local']) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) continue;
    for (const line of fs.readFileSync(fullPath, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

function extensionFor(url: string, contentType: string | null) {
  const types: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  };
  const fromType = contentType ? types[contentType.split(';')[0].trim()] : undefined;
  if (fromType) return fromType;
  try {
    const ext = new URL(url).pathname.split('.').pop()?.toLowerCase();
    if (ext === 'jpeg' || ext === 'jpg') return 'jpg';
    if (ext && ['png', 'webp', 'gif', 'svg'].includes(ext)) return ext;
  } catch {
    return 'jpg';
  }
  return 'jpg';
}

async function downloadImage(url: string, directory: string, name: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not download image (${response.status}) ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const ext = extensionFor(url, response.headers.get('content-type'));
  if (ext !== 'svg' && ext !== 'gif') {
    const saved = await writeWebpPair(buffer, directory, name);
    if (saved) return saved;
  }
  const filename = `${name}.${ext}`;
  await fs.promises.writeFile(path.join(directory, filename), buffer);
  return { filename, width: undefined, height: undefined, small: false };
}

function payload(block: RawBlock) {
  const value = block[block.type];
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function richFrom(value: unknown): RichText[] {
  return mapRichText(Array.isArray(value) ? value : undefined);
}

function parseFaq(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const match = line.match(/^Q:\s*(.+?)\s*\|\s*A:\s*(.+)$/i);
      if (!match) return [];
      return [{ q: match[1].trim(), a: match[2].trim() }];
    });
}

async function blocksFor(
  notion: Client,
  blockId: string,
  slug: string,
  imageDir: string,
  images: { count: number },
  headings: Post['headings'],
  usedIds: Set<string>,
  label: string,
): Promise<PostBlock[]> {
  const raw = await listBlocks(notion, blockId);
  const blocks: PostBlock[] = [];

  for (const block of raw) {
    if (PASS_THROUGH.has(block.type)) {
      console.warn(`${label}: passing through ${block.type} and keeping its children.`);
      blocks.push(
        ...(await blocksFor(notion, block.id, slug, imageDir, images, headings, usedIds, label)),
      );
      continue;
    }

    if (!SUPPORTED.has(block.type)) {
      console.warn(`${label}: skipped unsupported block "${block.type}".`);
      continue;
    }

    const data = payload(block);
    const richText = richFrom(data.rich_text);
    const text = richText.map((part) => part.text).join('');
    const stored: PostBlock = { id: block.id, type: block.type };

    if (richText.length > 0) {
      stored.richText = richText;
      stored.plainText = text;
    }

    if (block.type === 'to_do') stored.checked = Boolean(data.checked);
    if (block.type === 'code' && typeof data.language === 'string') stored.language = data.language;

    if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
      const level = Number(block.type.slice(-1));
      let id = slugify(text) || 'section';
      let n = 2;
      while (usedIds.has(id)) {
        id = `${slugify(text) || 'section'}-${n}`;
        n += 1;
      }
      usedIds.add(id);
      stored.id = id;
      headings.push({ id, text, level });
    }

    if (block.type === 'image') {
      const remote = (data.file as { url?: string } | undefined)?.url || (data.external as { url?: string } | undefined)?.url;
      if (!remote) throw new Error(`${label}: an image block has no file URL.`);
      images.count += 1;
      const saved = await downloadImage(remote, imageDir, `image-${images.count}`);
      stored.url = `/blog-images/${slug}/${saved.filename}`;
      stored.width = saved.width;
      stored.height = saved.height;
      stored.srcSet = saved.small ? webpSources(stored.url) : undefined;
      stored.caption = richFrom(data.caption);
    }

    if (block.type === 'bookmark' || block.type === 'embed' || block.type === 'video') {
      stored.url = typeof data.url === 'string' ? data.url : '';
      stored.caption = richFrom(data.caption);
    }

    if (block.type === 'table') {
      stored.headerRow = Boolean(data.has_column_header);
      const rows = await listBlocks(notion, block.id);
      stored.rows = rows
        .filter((row) => row.type === 'table_row')
        .map((row) => {
          const cells = payload(row).cells;
          if (!Array.isArray(cells)) return [];
          return cells.map((cell) => richFrom(cell));
        });
    } else if (block.has_children && block.type !== 'image') {
      stored.children = await blocksFor(notion, block.id, slug, imageDir, images, headings, usedIds, label);
    }

    blocks.push(stored);
  }

  return blocks;
}

function plainFrom(blocks: PostBlock[]): string {
  return blocks
    .map((block) => [block.plainText ?? '', block.caption?.map((part) => part.text).join('') ?? '', plainFrom(block.children ?? [])].join('\n'))
    .join('\n');
}

async function toPost(notion: Client, page: NotionPage, today: string): Promise<Post | null> {
  const properties = page.properties;
  const title = propertyText(properties.Title).trim();
  const label = title ? `Post "${title}"` : `Post ${page.id}`;
  const status = properties.Status?.select?.name ?? '';
  if (status !== 'Published') return null;

  const date = (properties.Date?.date?.start ?? '').slice(0, 10);
  if (!date) throw new Error(`${label} is missing Date.`);
  if (date > today) {
    console.log(`${label} is dated ${date}. Skipped until that day.`);
    return null;
  }

  const topic = properties.Topic?.select?.name?.trim() ?? '';
  const summary = propertyText(properties.Summary).trim();
  if (!title) throw new Error(`${label} is missing Title.`);
  if (!topic) throw new Error(`${label} is missing Topic.`);
  if (!summary) throw new Error(`${label} is missing Summary.`);

  const slug = slugify(propertyText(properties.Slug)) || slugify(title);
  if (!slug) throw new Error(`${label} needs a Slug.`);

  const imageDir = path.join(process.cwd(), 'public/blog-images', slug);
  await fs.promises.rm(imageDir, { recursive: true, force: true });
  await fs.promises.mkdir(imageDir, { recursive: true });

  let cover = '';
  const coverRemote = page.coverUrl || fileUrls(properties.Cover)[0] || '';
  if (coverRemote) {
    const saved = await downloadImage(coverRemote, imageDir, 'cover');
    cover = `/blog-images/${slug}/${saved.filename}`;
  }

  const headings: Post['headings'] = [];
  const blocks = await blocksFor(notion, page.id, slug, imageDir, { count: 0 }, headings, new Set(), label);
  const body = plainFrom(blocks);
  const tldr = propertyText(properties.TLDR)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    slug,
    title,
    titleHighlight: propertyText(properties.TitleHighlight).trim(),
    date,
    topic,
    summary,
    tldr,
    cover,
    videoUrl: properties.VideoURL?.url?.trim() ?? '',
    week: typeof properties.Week?.number === 'number' ? properties.Week.number : null,
    tags: (properties.Tags?.multi_select ?? []).map((tag) => tag.name ?? '').filter(Boolean),
    featured: Boolean(properties.Featured?.checkbox),
    seoTitle: propertyText(properties.SEOTitle).trim(),
    faq: parseFaq(propertyText(properties.FAQ)),
    readingMinutes: readingMinutes(body),
    headings,
    blocks,
    plainText: body,
    lastEdited: page.lastEdited,
  };
}

async function writePosts(posts: Post[]) {
  const contentDir = path.join(process.cwd(), 'content/posts');
  const imageRoot = path.join(process.cwd(), 'public/blog-images');
  await fs.promises.mkdir(contentDir, { recursive: true });
  await fs.promises.mkdir(imageRoot, { recursive: true });

  const slugs = new Set<string>();
  for (const post of posts) {
    if (slugs.has(post.slug)) throw new Error(`Two published posts use the slug "${post.slug}".`);
    slugs.add(post.slug);
    await fs.promises.writeFile(path.join(contentDir, `${post.slug}.json`), `${JSON.stringify(post, null, 2)}\n`);
  }

  for (const file of await fs.promises.readdir(contentDir)) {
    if (!file.endsWith('.json')) continue;
    const slug = file.slice(0, -5);
    if (!slugs.has(slug)) await fs.promises.rm(path.join(contentDir, file));
  }

  for (const entry of await fs.promises.readdir(imageRoot)) {
    if (entry === '.gitkeep' || slugs.has(entry)) continue;
    await fs.promises.rm(path.join(imageRoot, entry), { recursive: true, force: true });
  }
}

async function main() {
  loadEnv();
  const token = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_BLOG_DATA_SOURCE_ID;
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID;

  if (!token) {
    console.log('Skipping Notion fetch. Set NOTION_TOKEN and NOTION_BLOG_DATA_SOURCE_ID to publish posts.');
    return;
  }
  if (!dataSourceId && !databaseId) {
    throw new Error('NOTION_TOKEN is set. Also set NOTION_BLOG_DATA_SOURCE_ID or NOTION_BLOG_DATABASE_ID.');
  }

  const notion = createNotion(token);
  const today = todayInIndia();
  const resolvedId = await resolveDataSourceId(notion, dataSourceId, databaseId);
  console.log(`Fetching published posts on or before ${today}.`);
  const pages = await queryPublishedPosts(notion, resolvedId, today);
  const posts: Post[] = [];

  for (const page of pages) {
    const post = await toPost(notion, page, today);
    if (post) posts.push(post);
  }

  await writePosts(posts);
  console.log(`Wrote ${posts.length} post${posts.length === 1 ? '' : 's'} to content/posts.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
