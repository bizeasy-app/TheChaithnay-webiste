export function mailAddress(value: string): string | null {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return value;
  return null;
}

export function externalUrl(value: string): string | null {
  if (value.startsWith('https://') || value.startsWith('http://')) return value;
  return null;
}
