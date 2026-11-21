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
  languages: 'Telugu and English',
  cadence: {
    articles: 'One article every week',
    newsletter: 'One newsletter every two weeks',
  },
} as const;

export const principles = [
  { title: 'Curiosity over assumptions', body: 'Explore ideas and remain open to learning.' },
  { title: 'Experiments over theories', body: 'Test, build and share actual observations.' },
  { title: 'Clarity over complexity', body: 'Explain difficult concepts in simple language.' },
  { title: 'Value over virality', body: 'Prioritize usefulness and trust.' },
  { title: 'Progress over perfection', body: 'Share meaningful learning and improvement.' },
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
  { name: 'Students and learners', interests: 'Technology, skills and education' },
  { name: 'Developers and creators', interests: 'AI, coding and workflows' },
  { name: 'Founders and entrepreneurs', interests: 'Startups, products and business' },
  { name: 'Professionals', interests: 'Productivity, innovation and decision-making' },
] as const;

export const brandIs = [
  'An independent creator-led media platform.',
  'A source of original ideas and practical knowledge.',
  'A record of experiments and projects.',
  'A platform for technology and business insights.',
  'A long-term professional identity.',
] as const;

export const brandIsNot = [
  'A generic AI news page.',
  'A motivational quotes account.',
  'A collection of random viral videos.',
  'A fake expert or guru brand.',
  'A portfolio limited to technical skills.',
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
