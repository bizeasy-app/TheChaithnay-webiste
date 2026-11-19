import type { Metadata } from 'next';
import { BlogEnd } from '@/components/blog/BlogEnd';
import { BlogScreen, type BlogCard } from '@/components/blog/BlogScreen';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllPosts } from '@/lib/posts';
import { blogJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Blog — Founder log & lessons | The Chaithanya',
  description:
    'Startup lessons, AI tools and honest founder logs from India. Simple words, real numbers, no hype. New post every Saturday.',
  path: '/blog',
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
  }));

  return (
    <>
      <JsonLd data={blogJsonLd(getAllPosts())} />
      <BlogScreen posts={posts} />
      <BlogEnd />
    </>
  );
}
