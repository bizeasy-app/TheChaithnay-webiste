export function mailAddress(value: string): string | null {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return value;
  return null;
}

export function externalUrl(value: string): string | null {
  if (value.startsWith('https://') || value.startsWith('http://')) return value;
  return null;
}

/** Reads the video id from a youtube.com/watch, youtu.be or /shorts/ link. */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null;
    if (u.hostname.endsWith('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return v;
      const match = u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{6,})/);
      if (match) return match[1];
    }
  } catch {
    return null;
  }
  return null;
}
