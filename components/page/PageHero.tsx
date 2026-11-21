import { LineReveal } from '@/components/home/LineReveal';
import { Reveal } from '@/components/motion/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';

const DRIFT = [-48, 36, -24];

/**
 * Shared top of every section page, with the same motion as the home hero:
 * words rise in line by line, the last line gets the saffron dot and the
 * scribble, lines drift sideways on scroll, and the intro arrives after.
 */
export function PageHero({
  id,
  label,
  lines,
  intro,
  children,
}: {
  id: string;
  label: string;
  lines: string[];
  intro: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mx-auto flex w-full max-w-page flex-col gap-8 px-5 pt-16 min-[861px]:pt-[88px] max-[480px]:px-4">
      <div className="arrive">
        <SectionLabel blink className="tracking-[0.1em]">
          {label}
        </SectionLabel>
      </div>
      <LineReveal
        id={id}
        as="h1"
        className="m-0 text-[clamp(52px,9.6vw,150px)] font-extrabold leading-[0.92] tracking-[-0.055em]"
        spotlight={lines.length > 1}
        lines={lines.map((text, index) => ({
          text,
          driftX: DRIFT[index % DRIFT.length],
          dot: index === lines.length - 1,
          scribble: index === lines.length - 1,
        }))}
      />
      <div className="flex flex-wrap items-end justify-between gap-8">
        <p
          className="arrive m-0 max-w-[560px] flex-[1_1_380px] text-[21px] font-medium leading-normal text-body"
          style={{ animationDelay: '420ms' }}
        >
          {intro}
        </p>
        {children ? (
          <div className="arrive min-w-0 flex-[1_1_440px]" style={{ animationDelay: '520ms' }}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Section heading below the hero: words rise in when scrolled into view. */
export function SectionHead({ id, title, aside }: { id: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
      <LineReveal
        id={id}
        className="m-0 text-[clamp(40px,6vw,80px)] font-extrabold leading-[0.95] tracking-[-0.05em]"
        lines={[{ text: title }]}
      />
      {aside ? (
        <Reveal delay={120} className="max-w-[440px] text-[17px] font-medium leading-normal text-body">
          {aside}
        </Reveal>
      ) : null}
    </div>
  );
}

/** A dashed "not here yet" card: honest about what's coming. */
export function SoonCard({ title, body, index }: { title: string; body: string; index: number }) {
  return (
    <Reveal as="li" delay={(index % 3) * 90} className="soon-card lift relative flex min-h-[220px] flex-col justify-between gap-6 overflow-hidden rounded-[28px] border-2 border-dashed border-line-strong p-7">
      <span className="flex items-center justify-between font-mono text-[13px] font-medium text-muted">
        {String(index + 1).padStart(2, '0')}
        <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-2.5 py-1 font-sans text-[11px] font-extrabold uppercase tracking-[0.08em]">
          <span className="blink inline-block h-1.5 w-1.5 rounded-full bg-saffron" aria-hidden="true" />
          Coming soon
        </span>
      </span>
      <span className="flex flex-col gap-2">
        <span className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.03em]">{title}</span>
        <span className="text-[16px] leading-[1.5] text-body">{body}</span>
      </span>
    </Reveal>
  );
}
