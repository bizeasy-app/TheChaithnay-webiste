export const sources = ['home', 'blog', 'post', 'products', 'newsletter'] as const;
export const reasons = [
  'Collaboration',
  'Sponsorship',
  'Podcast or interview',
  'Suggest an experiment',
  'Just saying hi',
] as const;

export type Source = (typeof sources)[number];
export type Reason = (typeof reasons)[number];

export type SubscribeInput = {
  email: string;
  firstName: string;
  source: Source;
  tag: string;
};

export type ContactInput = {
  name: string;
  email: string;
  reason: Reason;
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, max: number) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}

export function isHoneypot(body: unknown) {
  if (!body || typeof body !== 'object') return false;
  const website = (body as { website?: unknown }).website;
  return typeof website === 'string' && website.trim() !== '';
}

export function readSubscribe(body: unknown): { ok: true; value: SubscribeInput } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Send a JSON body.' };
  const record = body as Record<string, unknown>;
  const email = text(record.email, 200).toLowerCase();
  const firstName = text(record.firstName, 80);
  const source = text(record.source, 40);
  const tag = text(record.tag, 40);

  if (!emailPattern.test(email)) return { ok: false, error: 'Enter a valid email.' };
  if (!sources.includes(source as Source)) return { ok: false, error: 'Unknown source.' };
  if (tag && !/^[a-z0-9-]+$/i.test(tag)) return { ok: false, error: 'Unknown tag.' };

  return { ok: true, value: { email, firstName, source: source as Source, tag } };
}

export function readContact(body: unknown): { ok: true; value: ContactInput } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Send a JSON body.' };
  const record = body as Record<string, unknown>;
  const name = text(record.name, 80);
  const email = text(record.email, 200).toLowerCase();
  const reason = typeof record.reason === 'string' ? record.reason.trim() : '';
  const message = text(record.message, 5000);

  if (!name) return { ok: false, error: 'Enter your name.' };
  if (!reasons.includes(reason as Reason)) return { ok: false, error: 'Choose a reason.' };
  if (message.length < 10) return { ok: false, error: 'Message must be at least 10 characters.' };
  if (email && !emailPattern.test(email)) return { ok: false, error: 'Enter a valid email.' };
  if (!email && reason !== 'Suggest an experiment') return { ok: false, error: 'Enter a valid email.' };

  return { ok: true, value: { name, email, reason: reason as Reason, message } };
}
