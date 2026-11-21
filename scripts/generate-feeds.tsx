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
    const link = absoluteUrl(`/insights/${post.slug}`);
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
    `Published: ${post.date} · Topic: ${post.topic} · URL: ${absoluteUrl(`/insights/${post.slug}`)}`,
    '',
  ];
  if (post.tldr.length > 0) {
    lines.push(...post.tldr.map((line) => `- ${line}`), '');
  }
  lines.push(blocksToMarkdown(post.blocks, post.title));
  return `${lines.join('\n').trim()}\n`;
}

function llms(posts: Post[]) {
  const postLines = posts.map((post) => `- [${post.title}](${absoluteUrl(`/insights/${post.slug}`)}): ${post.summary}`);
  return `# The Chaithanya

> An independent, creator-led media brand on technology, AI, entrepreneurship and productivity, by Chaithanya. Tagline: Try new. Learn fast. Build big.

A builder's perspective on technology, business and growth: original ideas, real experiments and practical lessons. The brand is faceless — real voice, real screen, real work — and publishes in Telugu and English. One article every week; a newsletter every two weeks.

## Start here
- [Home](${site.url}/): what The Chaithanya is
- [About](${site.url}/about): mission, philosophy and what the brand is and isn't
- [Insights](${site.url}/insights): all articles, filterable by pillar
- [Newsletter](${site.url}/newsletter): original insights by email, every two weeks

## Articles
${postLines.join('\n')}

## Pillars
- Technology & AI
- Business & Entrepreneurship
- Productivity & Thinking
- Building & Experiments

## Series
- The AI Brief
- Build Notes
- Business Thinking
- Better Systems
- The Deep Dive
- Things I Learned

## Follow
- [YouTube](${site.socials.youtube}): shorts and long-form videos
- [Instagram](${site.socials.instagram}): Reels and carousels
- [LinkedIn](${site.socials.linkedin}): business and technology insights
- [X](${site.socials.x}): opinions and observations

## Optional
- [Full text of all articles](${site.url}/llms-full.txt)
- [Projects](${site.url}/projects): products, experiments and case studies — coming soon
- [Resources](${site.url}/resources): tools, templates and guides — coming soon
- [Community](${site.url}/community): coming soon
- [Contact](${site.url}/contact): professional inquiries, partnerships and collaborations
`;
}

function llmsFull(posts: Post[]) {
  const header = llms([]).split('## Articles')[0].trim();
  const bodies = posts.map((post) => postMarkdown(post).trim());
  return `${header}\n\n${bodies.join('\n\n---\n\n')}\n`;
}

async function main() {
  const posts = getAllPosts();
  const ogDir = path.join(publicDir, 'og');
  const blogDir = path.join(publicDir, 'insights');
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
