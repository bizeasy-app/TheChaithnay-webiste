import fs from 'fs';
import path from 'path';
import type { FaqEntry, FaqIndex, PostEntry } from '@/components/askme/matcher';
import { tokens } from '@/components/askme/matcher';
import { getAllPosts } from '@/lib/posts';
import { site } from '@/lib/site';

const placeholders: Record<string, string> = {
  '[YOUTUBE_URL]': site.socials.youtube,
  '[INSTAGRAM_URL]': site.socials.instagram,
  '[X_URL]': site.socials.x,
  '[LINKEDIN_URL]': site.socials.linkedin,
};

function resolveLink(link: string) {
  return placeholders[link] ?? link;
}

function main() {
  const source = path.join(process.cwd(), 'content/faq.json');
  const faqs = (JSON.parse(fs.readFileSync(source, 'utf8')) as FaqEntry[]).map((entry) => ({
    ...entry,
    links: entry.links.map(resolveLink),
  }));

  const posts: PostEntry[] = [];

  for (const post of getAllPosts()) {
    post.faq.forEach((item, index) => {
      faqs.push({
        id: `${post.slug}-faq-${index + 1}`,
        q: item.q,
        keywords: tokens(item.q),
        a: item.a,
        links: [`/blog/${post.slug}`],
      });
    });

    posts.push({
      type: 'post',
      title: post.title,
      summary: post.summary,
      topic: post.topic,
      slug: post.slug,
      keywords: [...new Set(tokens(`${post.title} ${post.topic}`))],
    });
  }

  const index: FaqIndex = { faqs, posts };
  const target = path.join(process.cwd(), 'public/faq-index.json');
  fs.writeFileSync(target, `${JSON.stringify(index, null, 2)}\n`);
  console.log(`Wrote ${faqs.length} answers and ${posts.length} posts to public/faq-index.json.`);
}

main();
