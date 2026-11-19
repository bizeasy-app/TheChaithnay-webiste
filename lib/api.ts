/** Base URL for the Cloudflare Worker. Empty in production (same origin). */
export function apiUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_BASE ?? '').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
