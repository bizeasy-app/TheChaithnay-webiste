/** Brand guide v1.0, as data the pages render. Edit here, not in components. */

export const brand = {
  essence: 'Curious minds. Practical thinking. Meaningful building.',
  positioning:
    'A thoughtful creator exploring the intersection of technology, AI, entrepreneurship and productivity through original content, practical experiments and real-world experiences.',
  differentiation: 'A builder’s perspective on technology, business and growth.',
  mission:
    'To explore ideas, understand emerging technology, experiment with new possibilities and share valuable knowledge that helps people learn and build.',
  vision: 'To become a recognized and trusted independent media platform for technology, business, innovation and personal growth.',
  promise: [
    'Something useful to learn.',
    'Something interesting to understand.',
    'Something practical to try.',
    'Something meaningful to think about.',
  ],
  cadence: {
    articles: 'One article every week',
    newsletter: 'One newsletter every two weeks',
  },
} as const;

export const principles = [
  { title: 'Curiosity over assumptions', body: 'I would rather ask a dumb question than guess.' },
  { title: 'Experiments over theories', body: 'If I write about it, I have tried it.' },
  { title: 'Clarity over complexity', body: 'Hard ideas, plain words. No jargon to sound smart.' },
  { title: 'Value over virality', body: 'Useful beats loud. Your trust matters more than a view count.' },
  { title: 'Progress over perfection', body: 'Ship it, learn from it, share it. Then do it better.' },
] as const;

export const series = [
  { slug: 'ai-brief', name: 'The AI Brief', body: 'AI developments, tools and insights.' },
  { slug: 'build-notes', name: 'Build Notes', body: 'Product building and experiments.' },
  { slug: 'business-thinking', name: 'Business Thinking', body: 'Startup and business lessons.' },
  { slug: 'better-systems', name: 'Better Systems', body: 'Productivity and workflows.' },
  { slug: 'deep-dive', name: 'The Deep Dive', body: 'Detailed educational explanations.' },
  { slug: 'things-i-learned', name: 'Things I Learned', body: 'Experiences and practical lessons.' },
] as const;

export const audiences = [
  { name: 'Students and learners', interests: 'Who want skills that matter after the exam' },
  { name: 'Developers and creators', interests: 'Who want AI to do real work, not demos' },
  { name: 'Founders and entrepreneurs', interests: 'Who want lessons before they cost money' },
  { name: 'Professionals', interests: 'Who want to work smarter and decide better' },
] as const;

export const brandIs = [
  'Independent. No company tells me what to say.',
  'Original ideas and lessons you can use.',
  'A public record of real experiments and projects.',
  'Honest notes on technology and business.',
  'Built for the long run, one week at a time.',
] as const;

export const brandIsNot = [
  'Another AI news feed.',
  'Motivational quotes.',
  'Random viral videos.',
  'A guru selling a course.',
  'Just a portfolio of code.',
] as const;

/** The 8 sections from the website architecture, in nav order. */
export const sections = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/insights', label: 'Insights' },
  { href: '/projects', label: 'Projects' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/resources', label: 'Resources' },
  { href: '/community', label: 'Community' },
  { href: '/contact', label: 'Contact' },
] as const;
