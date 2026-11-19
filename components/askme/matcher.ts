export type FaqEntry = {
  id: string;
  q: string;
  keywords: string[];
  a: string;
  links: string[];
};

export type PostEntry = {
  type: 'post';
  title: string;
  summary: string;
  topic: string;
  slug: string;
  keywords: string[];
};

export type FaqIndex = {
  faqs: FaqEntry[];
  posts: PostEntry[];
};

export type AnswerLink = {
  href: string;
  title: string;
  topic: string;
};

export type Answer = {
  text: string;
  links: AnswerLink[];
};

export const FALLBACK =
  "I don't have an answer for that yet. Try a suggestion below, or send Chaithanya a message on the Contact page.";

const CONTACT: AnswerLink = {
  href: '/newsletter#contact',
  title: 'Contact',
  topic: 'Send a message',
};

const PAGES: Record<string, { title: string; topic: string }> = {
  '/': { title: 'Home', topic: 'The Chaithanya' },
  '/products': { title: 'Products & experiments', topic: 'The lab' },
  '/newsletter': { title: 'The weekly founder log', topic: 'Newsletter' },
  '/newsletter#contact': { title: 'Contact', topic: 'Newsletter' },
  '/blog': { title: 'Founder log & lessons', topic: 'Blog' },
  '/blog?topic=ai-tools': { title: 'AI tools & building', topic: 'Blog' },
};

const STOP = new Set(['the', 'a', 'is', 'are', 'how', 'do', 'i', 'you', 'what', 'to', 'of', 'in', 'for', 'my', 'me']);

const SYNONYMS: Record<string, string[]> = {
  ai: ['claude', 'tools'],
  claude: ['ai', 'tools'],
  tools: ['ai', 'claude'],
  newsletter: ['email', 'subscribe'],
  email: ['newsletter', 'subscribe'],
  subscribe: ['newsletter', 'email'],
  start: ['begin', 'first'],
  begin: ['start', 'first'],
  first: ['start', 'begin'],
};

export function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokens(value: string) {
  return normalise(value)
    .split(' ')
    .filter((token) => token && !STOP.has(token));
}

function expand(value: string) {
  const base = normalise(value);
  const extra = base.split(' ').flatMap((token) => SYNONYMS[token] ?? []);
  return normalise(`${base} ${extra.join(' ')}`);
}

function hasPhrase(text: string, phrase: string) {
  if (!phrase) return false;
  return ` ${text} `.includes(` ${phrase} `);
}

function usableHref(href: string) {
  if (href.startsWith('/')) return href;
  if (href.startsWith('https://') || href.startsWith('http://')) return href;
  return null;
}

function cardFor(href: string, index: FaqIndex): AnswerLink | null {
  const safe = usableHref(href);
  if (!safe) return null;
  const post = index.posts.find((item) => safe === `/blog/${item.slug}` || safe.startsWith(`/blog/${item.slug}#`));
  if (post) return { href: safe, title: post.title, topic: post.topic };
  const page = PAGES[safe];
  if (page) return { href: safe, title: page.title, topic: page.topic };
  return { href: safe, title: safe, topic: 'On this site' };
}

function cards(hrefs: string[], index: FaqIndex) {
  const seen = new Set<string>();
  const links: AnswerLink[] = [];
  for (const href of hrefs) {
    const card = cardFor(href, index);
    if (!card || seen.has(card.href)) continue;
    seen.add(card.href);
    links.push(card);
    if (links.length === 3) break;
  }
  return links;
}

function scoreFaq(normalised: string, expandedText: string, questionTokens: string[], faq: FaqEntry, scope?: string) {
  let score = 0;
  for (const keyword of faq.keywords) {
    if (hasPhrase(expandedText, normalise(keyword))) score += 3;
  }
  const faqTokens = new Set(tokens(faq.q));
  for (const token of questionTokens) {
    if (faqTokens.has(token)) score += 1;
  }
  if (hasPhrase(normalised, normalise(faq.q))) score += 2;
  if (scope && faq.links.some((link) => link === `/blog/${scope}` || link.startsWith(`/blog/${scope}#`))) score += 4;
  return score;
}

function scorePost(questionTokens: string[], post: PostEntry, scope?: string) {
  const title = new Set(tokens(post.title));
  const rest = new Set(tokens(`${post.summary} ${post.topic}`));
  let score = 0;
  for (const token of questionTokens) {
    if (title.has(token)) score += 2;
    if (rest.has(token)) score += 1;
  }
  if (scope && post.slug === scope) score += 4;
  return score;
}

export function matchQuestion(question: string, index: FaqIndex, scope?: string): Answer {
  const normalised = normalise(question);
  const expandedText = expand(question);
  const questionTokens = tokens(expandedText);
  if (!normalised) return { text: FALLBACK, links: [CONTACT] };

  let bestFaq: FaqEntry | null = null;
  let bestFaqScore = 0;
  for (const faq of index.faqs) {
    const score = scoreFaq(normalised, expandedText, questionTokens, faq, scope);
    if (score > bestFaqScore) {
      bestFaq = faq;
      bestFaqScore = score;
    }
  }

  if (bestFaq && bestFaqScore >= 3) {
    return { text: bestFaq.a, links: cards(bestFaq.links, index) };
  }

  const ranked = index.posts
    .map((post) => ({ post, score: scorePost(questionTokens, post, scope) }))
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (ranked.length > 0) {
    return {
      text: 'These posts should help:',
      links: ranked.map((item) => ({
        href: `/blog/${item.post.slug}`,
        title: item.post.title,
        topic: item.post.topic,
      })),
    };
  }

  return { text: FALLBACK, links: [CONTACT] };
}
