import { LetterGrid } from '@/components/home/LetterGrid';
import { LineReveal } from '@/components/home/LineReveal';
import { Button } from '@/components/ui/Button';
import { externalUrl } from '@/lib/links';
import { site } from '@/lib/site';

export function Hero() {
  const channel = externalUrl(site.socials.youtube);
  const announcement = 'Watch the latest video\u00a0→';
  const className =
    'arrive m-0 inline-flex items-center gap-2.5 self-start rounded-full border border-line bg-white py-2 pl-2.5 pr-4 text-sm font-bold text-ink no-underline transition duration-300 hover:-translate-y-0.5 hover:shadow-lift';

  const pill = (
    <>
      <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-extrabold tracking-[0.06em] text-cloud">NEW</span>
      {announcement}
    </>
  );

  return (
    <section aria-labelledby="hero-h" className="relative mx-auto flex w-full max-w-page flex-col gap-8 px-5 pt-16 min-[861px]:pt-[88px] max-[480px]:px-4">
      {channel ? (
        <a href={channel} className={className} target="_blank" rel="noopener noreferrer" data-cursor="Watch">
          {pill}
        </a>
      ) : (
        <p className={className}>{pill}</p>
      )}
      <LineReveal
        id="hero-h"
        as="h1"
        className="m-0 text-[clamp(56px,9.6vw,150px)] font-extrabold leading-[0.92] tracking-[-0.055em]"
        spotlight
        lines={[
          { text: 'Try new.', driftX: -48 },
          { text: 'Learn fast.', driftX: 36 },
          { text: 'Build big', dot: true, scribble: true, driftX: -24 },
        ]}
      />
      <div
        className="arrive pointer-events-none absolute right-5 top-[150px] hidden w-[300px] min-[1180px]:block"
        style={{ animationDelay: '700ms' }}
        data-speed="0.12"
      >
        <LetterGrid />
      </div>
      <div className="flex max-w-[620px] flex-col gap-7">
        <p className="arrive m-0 text-[clamp(19px,1.6vw,22px)] font-medium leading-[1.5] text-body" style={{ animationDelay: '420ms' }}>
          I try new tech, build something real with it and tell you exactly what happened, so you can skip the hype and start building.
        </p>
        <div className="arrive flex flex-wrap items-center gap-3" style={{ animationDelay: '540ms' }}>
          <Button href="/insights" size="lg">
            Start reading
          </Button>
          <Button href="/newsletter" variant="outline" size="lg">
            Get the newsletter
          </Button>
        </div>
      </div>
      <div className="scroll-cue flex flex-col items-center gap-2 pt-10 text-[13px] font-bold text-muted" aria-hidden="true">
        <span>Scroll for the story</span>
        <span className="scroll-cue-line block h-10 w-px bg-saffron" />
      </div>
    </section>
  );
}
