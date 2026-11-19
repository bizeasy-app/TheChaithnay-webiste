import Link from 'next/link';
import type { RichText } from '@/lib/notion';

export function RichTextView({ parts, tone = 'ink' }: { parts?: RichText[]; tone?: 'ink' | 'cloud' }) {
  if (!parts || parts.length === 0) return null;

  return (
    <>
      {parts.map((part, index) => {
        let node: React.ReactNode = part.text;
        if (part.code) node = <code className="rounded bg-white px-1 font-mono text-[0.9em] text-ink">{node}</code>;
        if (part.bold) node = <strong className="font-extrabold">{node}</strong>;
        if (part.italic) node = <em>{node}</em>;
        if (part.underline) node = <span className="underline">{node}</span>;
        if (part.strikethrough) node = <s>{node}</s>;
        if (part.href) {
          const external = /^https?:\/\//i.test(part.href);
          const className = tone === 'cloud' ? 'text-cloud underline' : 'text-ink underline';
          node = external ? (
            <a href={part.href} className={className} rel="noopener noreferrer" target="_blank">
              {node}
            </a>
          ) : (
            <Link href={part.href} className={className}>
              {node}
            </Link>
          );
        }
        return <span key={`${index}-${part.text.slice(0, 12)}`}>{node}</span>;
      })}
    </>
  );
}
