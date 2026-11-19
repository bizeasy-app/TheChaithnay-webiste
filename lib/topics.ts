export const topics = [
  { slug: 'startup-lessons', label: 'Startup lessons' },
  { slug: 'ai-tools', label: 'AI tools & building' },
  { slug: 'money-investing', label: 'Money & investing' },
  { slug: 'life-mindset', label: 'Life & mindset' },
] as const;

export function topicBySlug(slug: string) {
  return topics.find((topic) => topic.slug === slug) ?? null;
}

export function topicSlug(label: string) {
  return topics.find((topic) => topic.label === label)?.slug ?? '';
}
