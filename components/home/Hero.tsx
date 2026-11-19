import { AskBar } from '@/components/home/AskBar';
import { LineReveal } from '@/components/home/LineReveal';
import { externalUrl } from '@/lib/links';
import { site } from '@/lib/site';

export function Hero() {
  const channel = externalUrl(site.socials.youtube);
  const announcement = `Founder log, week ${site.latestVideo.week} drops Saturday\u00a0→`;
  const className =
    'arrive m-0 inline-flex items-center gap-2.5 self-start rounded-full border border-line bg-white py-2 pl-2.5 pr-4 text-sm font-bold text-ink no-underline transition duration-300 hover:-translate-y-0.5 hover:shadow-lift';

  const pill = (
    <>
      <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-extrabold tracking-[0.06em] text-cloud">NEW</span>
      {announcement}
    </>
  );

  return (
    <section aria-labelledby="hero-h" className="mx-auto flex w-full max-w-page flex-col gap-8 px-5 pt-16 min-[861px]:pt-[88px] max-[480px]:px-4">
      {channel ? (
        <a href={channel} className={className} target="_blank" rel="noopener noreferrer">
          {pill}
        </a>
      ) : (
        <p className={className}>{pill}</p>
      )}
      <LineReveal
        id="hero-h"
        as="h1"
        className="m-0 text-[clamp(56px,9.6vw,150px)] font-extrabold leading-[0.92] tracking-[-0.055em]"
        lines={[{ text: 'Try new.' }, { text: 'Learn fast.' }, { text: 'Build big', dot: true }]}
      />
      <div className="flex flex-wrap items-end justify-between gap-8">
        <p className="arrive m-0 min-w-0 max-w-[520px] flex-[1_1_380px] text-[21px] font-medium leading-[1.5] text-body" style={{ animationDelay: '420ms' }}>
          I try new things first, and show you how to win with them. A solo Indian founder building with AI — wins and failures, on screen.
        </p>
        <AskBar className="arrive" style={{ animationDelay: '520ms' }} />
      </div>
      <div className="scroll-cue flex flex-col items-center gap-2 pt-6 text-[12px] font-extrabold uppercase tracking-[0.16em] text-muted" aria-hidden="true">
        <span>Scroll</span>
        <span className="scroll-cue-line block h-10 w-px bg-saffron" />
      </div>
    </section>
  );
}
