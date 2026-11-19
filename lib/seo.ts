import type { Metadata } from 'next';
import { externalUrl } from '@/lib/links';
import type { Post } from '@/lib/posts';
import { site } from '@/lib/site';
import { youtubeId } from '@/lib/youtube';

export const homeTitle = 'The Chaithanya — Try new. Learn fast. Build big.';

const brandSuffix = ' | The Chaithanya';

export function absoluteUrl(path = '/') {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return new URL(path, site.url).toString();
}

export function socialUrls() {
  return Object.values(site.socials).flatMap((url) => {
    const safe = externalUrl(url);
    return safe ? [safe] : [];
  });
}

export function metaDescription(text: string, max = 155) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  const base = space > 80 ? cut.slice(0, space) : cut;
  return `${base.trimEnd()}…`;
}

export function brandedTitle(name: string) {
  const full = `${name}${brandSuffix}`;
  if (full.length <= 60) return full;
  const room = 60 - brandSuffix.length - 1;
  return `${name.slice(0, Math.max(room, 1)).trimEnd()}…${brandSuffix}`;
}

export function pageMetadata({
  title,
  description,
  path,
  ogImage = '/og/default.png',
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags,
  index = true,
  markdown,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  index?: boolean;
  markdown?: string;
}): Metadata {
  const canonical = absoluteUrl(path);
  const image = absoluteUrl(ogImage);
  const images = [{ url: image, width: 1200, height: 630, alt: title }];
  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
  };
  if (site.twitter.startsWith('@') && !site.twitter.includes('[')) twitter.site = site.twitter;

  const shared = {
    url: canonical,
    title,
    description,
    siteName: site.name,
    locale: site.locale,
    images,
  };

  return {
    title,
    description,
    alternates: {
      canonical,
      types: {
        'application/rss+xml': '/rss.xml',
        ...(markdown ? { 'text/markdown': markdown } : {}),
      },
    },
    robots: { index, follow: true },
    openGraph:
      type === 'article'
        ? { ...shared, type: 'article', publishedTime, modifiedTime, section, tags }
        : { ...shared, type: 'website' },
    twitter,
  };
}

function organization() {
  const sameAs = socialUrls();
  return {
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: absoluteUrl('/icon-512.png'),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

function person() {
  const sameAs = socialUrls();
  return {
    '@type': 'Person',
    name: site.author,
    url: site.url,
    jobTitle: 'Founder',
    description: site.description,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: site.name,
        url: site.url,
        description: site.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${site.url}/blog?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      person(),
      organization(),
    ],
  };
}

export function blogJsonLd(posts: Post[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Founder log & lessons',
    url: absoluteUrl('/blog'),
    description: 'Startup lessons, AI tools and honest founder logs from India. Simple words, real numbers, no hype. New post every Saturday.',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.date,
    })),
  };
}

export function postJsonLd(post: Post) {
  const pageUrl = absoluteUrl(`/blog/${post.slug}`);
  const image = absoluteUrl(post.cover || `/og/${post.slug}.png`);
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BlogPosting',
      headline: post.seoTitle || post.title,
      description: metaDescription(post.summary),
      image,
      datePublished: post.date,
      dateModified: post.lastEdited || post.date,
      author: { '@type': 'Person', name: site.author, url: site.url },
      publisher: organization(),
      mainEntityOfPage: pageUrl,
      articleSection: post.topic,
      keywords: post.tags.join(', '),
      url: pageUrl,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
        { '@type': 'ListItem', position: 3, name: post.title, item: pageUrl },
      ],
    },
  ];

  const video = post.videoUrl ? youtubeId(post.videoUrl) : '';
  if (video) {
    graph.push({
      '@type': 'VideoObject',
      name: post.title,
      description: metaDescription(post.summary),
      thumbnailUrl: `https://i.ytimg.com/vi/${video}/hqdefault.jpg`,
      uploadDate: post.date,
      embedUrl: `https://www.youtube-nocookie.com/embed/${video}`,
      contentUrl: post.videoUrl,
    });
  }

  if (post.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: post.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

export function newsletterJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'The weekly founder log newsletter',
        url: absoluteUrl('/newsletter'),
        description: 'One email every Saturday: what I tried, what happened, and one AI tool or system you can steal. Free.',
      },
      {
        '@type': 'ContactPage',
        name: 'Connect',
        description: 'Write Chaithanya about collabs, sponsorships, podcasts, or experiment ideas.',
        url: absoluteUrl('/newsletter#contact'),
      },
    ],
  };
}
