import { apiUrl } from '@/lib/api';

export const contactReasons = [
  'Collaboration',
  'Sponsorship',
  'Podcast or interview',
  'Suggest an experiment',
  'Just saying hi',
] as const;

export type ContactReason = (typeof contactReasons)[number];

export type ContactInput = {
  name: string;
  email: string;
  reason: ContactReason;
  message: string;
  website?: string;
};

const ERROR = "That didn't work. Try again in a minute.";

export async function contact(input: ContactInput): Promise<{ ok: true } | { ok: false; error: string }> {
  if (input.website) return { ok: true };

  try {
    const response = await fetch(apiUrl('/api/contact'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        reason: input.reason,
        message: input.message,
        website: '',
      }),
    });

    if (!response.ok) return { ok: false, error: ERROR };

    const data = (await response.json().catch(() => null)) as { ok?: boolean } | null;
    if (!data?.ok) return { ok: false, error: ERROR };

    return { ok: true };
  } catch {
    return { ok: false, error: ERROR };
  }
}
