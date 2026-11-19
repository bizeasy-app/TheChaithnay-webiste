export function formatPostDate(iso: string) {
  const date = new Date(`${iso.slice(0, 10)}T00:00:00+05:30`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}
