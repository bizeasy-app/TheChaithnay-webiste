/**
 * Content pillars from the brand guide. Each post's Notion "Topic" select
 * must use one of these labels exactly for the Insights filter to find it.
 */
export const topics = [
  {
    slug: 'technology-ai',
    short: 'AI',
    label: 'Technology & AI',
    share: 30,
    blurb: 'AI developments, AI tools and experiments, software engineering, and the future of technology.',
  },
  {
    slug: 'business',
    short: 'Business',
    label: 'Business & Entrepreneurship',
    share: 30,
    blurb: 'Startup building, product, marketing and sales, business models, and founder lessons.',
  },
  {
    slug: 'productivity',
    short: 'Thinking',
    label: 'Productivity & Thinking',
    share: 20,
    blurb: 'Deep work, focus, decision-making, learning systems, and personal effectiveness.',
  },
  {
    slug: 'building',
    short: 'Building',
    label: 'Building & Experiments',
    share: 20,
    blurb: 'Real projects, SaaS builds, AI workflows, product experiments — what worked and what failed.',
  },
] as const;

export function topicBySlug(slug: string) {
  return topics.find((topic) => topic.slug === slug) ?? null;
}

export function topicSlug(label: string) {
  return topics.find((topic) => topic.label === label)?.slug ?? '';
}
