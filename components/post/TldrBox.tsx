import { BinduMark } from '@/components/brand/BinduMark';

export function TldrBox({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;

  return (
    <section aria-label="Summary" className="flex flex-col gap-3.5 rounded-[22px] border border-line bg-white p-7">
      <span className="flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted">
        <BinduMark size={20} />
        TL;DR in 3 lines
      </span>
      <ul className="m-0 flex list-disc flex-col gap-2 pl-[22px] text-[18px] leading-[1.55] text-ink">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
