import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

const hidden = ['/dev/ui', '/insights/__empty'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: hidden },
      { userAgent: 'GPTBot', allow: '/', disallow: hidden },
      { userAgent: 'ClaudeBot', allow: '/', disallow: hidden },
      { userAgent: 'PerplexityBot', allow: '/', disallow: hidden },
      { userAgent: 'Google-Extended', allow: '/', disallow: hidden },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
