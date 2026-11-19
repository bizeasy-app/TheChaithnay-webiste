import { apiUrl } from '@/lib/api';

export type SubscribeSource = 'home' | 'blog' | 'post' | 'products' | 'newsletter';

export type SubscribeInput = {
  email: string;
  firstName?: string;
  source: SubscribeSource;
  tag?: string;
  website?: string;
};

const ERROR = "That didn't work. Try again in a minute.";

export async function subscribe(input: SubscribeInput): Promise<{ ok: true } | { ok: false; error: string }> {
  if (input.website) {
    return { ok: true };
  }

  try {
    const response = await fetch(apiUrl('/api/subscribe'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: input.email,
        firstName: input.firstName ?? '',
        source: input.source,
        tag: input.tag ?? '',
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
