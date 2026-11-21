import type { Metadata } from 'next';
import { BlogEnd } from '@/components/insights/BlogEnd';
import { BlogScreen, type BlogCard } from '@/components/insights/BlogScreen';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllPosts } from '@/lib/posts';
import { blogJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Insights | The Chaithanya',
  description:
    'Articles on technology, AI, business and productivity — opinions, tutorials and lessons from real experiments. One new article every week.',
  path: '/insights',
});

export default function BlogPage() {
  const posts: BlogCard[] = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    titleHighlight: post.titleHighlight,
    topic: post.topic,
    summary: post.summary,
    videoUrl: post.videoUrl,
    featured: post.featured,
    date: post.date,
    cover: post.cover,
    readingMinutes: post.readingMinutes,
  }));

  return (
    <>
      <JsonLd data={blogJsonLd(getAllPosts())} />
      <BlogScreen posts={posts} />
      <BlogEnd />
    </>
  );
}
