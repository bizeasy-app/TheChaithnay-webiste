import React, { type ReactNode } from 'react';
import fs from 'fs';
import path from 'path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { blocksToMarkdown } from '@/lib/markdown';
import { getAllPosts, type Post } from '@/lib/posts';
import { absoluteUrl } from '@/lib/seo';
import { site } from '@/lib/site';

const publicDir = path.join(process.cwd(), 'public');

function font(weight: 500 | 800) {
  return fs.readFileSync(path.join(process.cwd(), 'app/fonts', `manrope-${weight}.woff2`));
}

function Bindu({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path
        d="M29.37 9.6 A14 14 0 1 0 29.37 30.4"
        fill="none"
        stroke="#F0EEE9"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="34" cy="20" r="4" fill="#E8792B" />
    </svg>
  );
}

function defaultCard() {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: '#1A1714',
        color: '#F0EEE9',
        display: 'flex',
        alignItems: 'center',
        padding: '72px',
        gap: '48px',
      }}
    >
      <Bindu size={180} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '72px', fontWeight: 800, lineHeight: 1.05 }}>
          <span>Try new.</span>
          <span>Learn fast.</span>
          <span style={{ color: '#E8792B' }}>Build big.</span>
        </div>
        <span style={{ color: '#B3A99E', fontSize: '28px', fontWeight: 500 }}>thechaithanya.com</span>
      </div>
    </div>
  );
}

function postCard(post: Post) {
  const size = post.title.length > 70 ? 48 : post.title.length > 42 ? 56 : 64;
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: '#26305C',
        color: '#F0EEE9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ color: '#C9C6D9', fontSize: '24px', fontWeight: 800, letterSpacing: '2px' }}>
          {post.topic.toUpperCase()}
        </span>
        <Bindu size={88} />
      </div>
      <div style={{ fontSize: `${size}px`, fontWeight: 800, lineHeight: 1.05, maxWidth: '1000px' }}>{post.title}</div>
    </div>
  );
}

async function renderPng(node: ReactNode) {
  const svg = await satori(node, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Manrope', data: font(500), weight: 500, style: 'normal' },
      { name: 'Manrope', data: font(800), weight: 800, style: 'normal' },
    ],
  });
  return new Resvg(svg).render().asPng();
}

function xml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rss(posts: Post[]) {
  const items = posts.slice(0, 20).map((post) => {
    const link = absoluteUrl(`/blog/${post.slug}`);
    const date = new Date(`${post.date}T00:00:00+05:30`).toUTCString();
    return `    <item>
      <title>${xml(post.title)}</title>
      <link>${xml(link)}</link>
      <guid>${xml(link)}</guid>
      <pubDate>${date}</pubDate>
      <description>${xml(post.summary)}</description>
      <category>${xml(post.topic)}</category>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xml(site.name)}</title>
    <link>${xml(site.url)}</link>
    <description>${xml(site.description)}</description>
    <language>en-in</language>
${items.join('\n')}
  </channel>
</rss>
`;
}

function postMarkdown(post: Post) {
  const lines = [
    `# ${post.title}`,
    '',
    `Published: ${post.date} · Topic: ${post.topic} · URL: ${absoluteUrl(`/blog/${post.slug}`)}`,
    '',
  ];
  if (post.tldr.length > 0) {
    lines.push(...post.tldr.map((line) => `- ${line}`), '');
  }
  lines.push(blocksToMarkdown(post.blocks, post.title));
  return `${lines.join('\n').trim()}\n`;
}

function llms(posts: Post[]) {
  const postLines = posts.map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.summary}`);
  return `# The Chaithanya

> Founder log from Chaithanya, a solo Indian founder building with AI. Startup lessons, AI tools & building, money & investing, and life & mindset — shared honestly, wins and failures, every Saturday. Tagline: Try new. Learn fast. Build big.

The Chaithanya is a faceless personal brand: screen, voice and story — no face on camera. Content is in English, for young Indians (18–30) who want to build something. Products are being built in public and are not public yet.

## Start here
- [Home](${site.url}/): who Chaithanya is and what the founder log is
- [Blog](${site.url}/blog): all posts, filterable by topic
- [Newsletter](${site.url}/newsletter): the weekly founder log by email, every Saturday

## Posts
${postLines.join('\n')}

## Topics
- Startup lessons
- AI tools & building
- Money & investing
- Life & mindset

## Follow
- [YouTube](${site.socials.youtube}): weekly founder log video, every Saturday
- [Instagram](${site.socials.instagram}): Reels
- [X](${site.socials.x}): build notes
- [LinkedIn](${site.socials.linkedin}): founder lessons

## Optional
- [Full text of all posts](${site.url}/llms-full.txt)
- [Products & experiments](${site.url}/products): coming soon
- [Connect](${site.url}/newsletter#contact): write about collabs, sponsorships, podcasts, or experiment ideas
`;
}

function llmsFull(posts: Post[]) {
  const header = llms([]).split('## Posts')[0].trim();
  const bodies = posts.map((post) => postMarkdown(post).trim());
  return `${header}\n\n${bodies.join('\n\n---\n\n')}\n`;
}

async function main() {
  const posts = getAllPosts();
  const ogDir = path.join(publicDir, 'og');
  const blogDir = path.join(publicDir, 'blog');
  fs.mkdirSync(ogDir, { recursive: true });
  fs.mkdirSync(blogDir, { recursive: true });

  fs.writeFileSync(path.join(ogDir, 'default.png'), await renderPng(defaultCard()));
  const slugs = new Set<string>();
  for (const post of posts) {
    slugs.add(post.slug);
    fs.writeFileSync(path.join(ogDir, `${post.slug}.png`), await renderPng(postCard(post)));
    fs.writeFileSync(path.join(blogDir, `${post.slug}.md`), postMarkdown(post));
  }

  for (const file of fs.readdirSync(ogDir)) {
    if (file === 'default.png' || file === '.gitkeep') continue;
    const slug = file.replace(/\.png$/, '');
    if (!slugs.has(slug)) fs.rmSync(path.join(ogDir, file));
  }
  for (const file of fs.readdirSync(blogDir)) {
    if (!file.endsWith('.md')) continue;
    if (!slugs.has(file.slice(0, -3))) fs.rmSync(path.join(blogDir, file));
  }

  fs.writeFileSync(path.join(publicDir, 'rss.xml'), rss(posts));
  fs.writeFileSync(path.join(publicDir, 'llms.txt'), llms(posts));
  fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), llmsFull(posts));
  console.log(`Wrote feeds, llms.txt and ${posts.length} post image${posts.length === 1 ? '' : 's'}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
