import fs from 'fs';
import path from 'path';
import type { RichText } from '@/lib/notion';

export type PostBlock = {
  id: string;
  type: string;
  richText?: RichText[];
  plainText?: string;
  checked?: boolean;
  language?: string;
  url?: string;
  srcSet?: string;
  caption?: RichText[];
  width?: number;
  height?: number;
  rows?: RichText[][][];
  headerRow?: boolean;
  children?: PostBlock[];
};

export type Post = {
  slug: string;
  title: string;
  titleHighlight: string;
  date: string;
  topic: string;
  summary: string;
  tldr: string[];
  cover: string;
  videoUrl: string;
  week: number | null;
  tags: string[];
  featured: boolean;
  seoTitle: string;
  faq: Array<{ q: string; a: string }>;
  readingMinutes: number;
  headings: Array<{ id: string; text: string; level: number }>;
  blocks: PostBlock[];
  plainText: string;
  lastEdited: string;
};

const directory = path.join(process.cwd(), 'content/posts');

export function getAllPosts(): Post[] {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .flatMap((file) => {
      try {
        const post = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')) as Post;
        if (!post.slug || !post.title || !post.date || !post.topic) return [];
        return [post];
      } catch {
        return [];
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  return getAllPosts().find((post) => post.slug === slug) ?? null;
}

export function getLatestPosts(limit = 3) {
  return getAllPosts().slice(0, limit);
}

export function getByTopic(topic: string) {
  return getAllPosts().filter((post) => post.topic === topic);
}

export function getFeatured() {
  const posts = getAllPosts();
  return posts.find((post) => post.featured) ?? posts[0] ?? null;
}

export function postOutline(post: Post) {
  const items: Array<{ id: string; text: string; depth: number }> = [];
  const used = new Set<string>();

  for (const heading of post.headings) {
    if (heading.level > 2) continue;
    items.push({ id: heading.id, text: heading.text, depth: heading.level });
    used.add(heading.id);
  }

  const stealIds = new Map<string, string>();
  let count = 0;

  function walk(blocks: PostBlock[]) {
    for (const block of blocks) {
      const text = (block.plainText ?? '').trim();
      if (block.type === 'callout' && /^steal\b/i.test(text)) {
        count += 1;
        let id = count === 1 ? 'steal' : `steal-${count}`;
        while (used.has(id)) {
          count += 1;
          id = `steal-${count}`;
        }
        used.add(id);
        stealIds.set(block.id, id);
        items.push({ id, text: 'Steal this', depth: 1 });
      }
      if (block.children) walk(block.children);
    }
  }

  walk(post.blocks);
  return { items, stealIds };
}

export function getReadNext(slug: string, limit = 3) {
  const current = getPost(slug);
  if (!current) return [];
  const rest = getAllPosts().filter((post) => post.slug !== slug);
  const sameTopic = rest.filter((post) => post.topic === current.topic);
  const otherTopics = rest.filter((post) => post.topic !== current.topic);
  return [...sameTopic, ...otherTopics].slice(0, limit);
}
