import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const paths = ['/', '/about', '/insights', '/projects', '/newsletter', '/resources', '/community', '/contact', '/privacy'];

  return [
    ...paths.map((path) => ({ url: absoluteUrl(path) })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/insights/${post.slug}`),
      lastModified: new Date(post.lastEdited || post.date),
    })),
  ];
}
