import type { Metadata } from 'next';
import { BinduMark } from '@/components/brand/BinduMark';
import { Reveal } from '@/components/motion/Reveal';
import { PageHero, SectionHead } from '@/components/page/PageHero';
import { Button } from '@/components/ui/Button';
import { audiences, brand, brandIs, brandIsNot, principles } from '@/lib/brand';
import { pageMetadata } from '@/lib/seo';
import { topics } from '@/lib/topics';

export const metadata: Metadata = pageMetadata({
  title: 'About | The Chaithanya',
  description:
    'The Chaithanya is an independent, creator-led media brand on technology, AI, entrepreneurship and productivity. Try new. Learn fast. Build big.',
  path: '/about',
});

const wrap = 'mx-auto w-full max-w-page px-5 pt-20 min-[861px]:pt-28 max-[480px]:px-4';

export default function AboutPage() {
  return (
    <>
      <PageHero
        id="about-h"
        label="About · The Chaithanya"
        lines={['Try new.', 'Learn fast.', 'Build big']}
        intro={
          <>
            I&apos;m Chaithanya. This is my independent media brand on technology, AI, entrepreneurship and productivity — a
            builder&apos;s perspective, shared through original content and real experiments.
          </>
        }
      />

      {/* Who's behind it */}
      <section aria-labelledby="who-h" className={wrap}>
        <div className="grid gap-5 min-[961px]:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="flex flex-col gap-6 rounded-[32px] bg-indigo p-8 text-paper min-[861px]:p-12">
            <BinduMark size={56} tone="paper" />
            <h2 id="who-h" className="m-0 text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              No face. Real work.
            </h2>
            <p className="m-0 max-w-[52ch] text-[18px] leading-[1.6] text-on-indigo-soft">
              This is a faceless brand, not an anonymous one. You&apos;ll hear my real voice, see my real screen, and read about
              real experiments — what I tried, what happened, and what I&apos;d do differently. No AI-content aggregation, no
              borrowed opinions.
            </p>
            <p className="m-0 text-[15px] font-bold uppercase tracking-[0.08em] text-on-indigo">
              In {brand.languages}
            </p>
          </Reveal>
          <Reveal delay={90} className="flex flex-col justify-between gap-8 rounded-[32px] border border-line bg-white p-8 min-[861px]:p-12">
            <div className="flex flex-col gap-3">
              <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted">Mission</p>
              <p className="m-0 text-[22px] font-bold leading-[1.35] tracking-[-0.015em]">{brand.mission}</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted">Vision</p>
              <p className="m-0 text-[18px] leading-[1.5] text-body">{brand.vision}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section aria-labelledby="phil-h" className={wrap}>
        <SectionHead id="phil-h" title="Five principles" aside="These decide what gets made, and what doesn't." />
        <ol className="m-0 flex list-none flex-col p-0">
          {principles.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 70} className="row-wipe grid gap-2 border-t border-line py-7 min-[861px]:grid-cols-[80px_1fr_1fr] min-[861px]:items-baseline">
              <span className="font-mono text-[14px] font-medium text-muted">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.05] tracking-[-0.035em]">{item.title}</span>
              <span className="text-[18px] leading-[1.5] text-body">{item.body}</span>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Interests */}
      <section aria-labelledby="int-h" className={wrap}>
        <SectionHead id="int-h" title="What I explore" aside="Four pillars. Every post sits in one of them." />
        <ul className="m-0 grid list-none gap-5 p-0 min-[640px]:grid-cols-2">
          {topics.map((topic, index) => (
            <Reveal as="li" key={topic.slug} delay={(index % 2) * 90} className="lift flex flex-col gap-4 rounded-[28px] border border-line bg-white p-8">
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em]">{topic.label}</span>
                <span className="font-mono text-[14px] font-medium text-saffron">{topic.share}%</span>
              </span>
              <span className="text-[17px] leading-[1.55] text-body">{topic.blurb}</span>
              <span className="mt-auto h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
                <span className="block h-full rounded-full bg-saffron" style={{ width: `${topic.share * 3.3}%` }} />
              </span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Who it's for */}
      <section aria-labelledby="aud-h" className={wrap}>
        <SectionHead id="aud-h" title="Who it's for" aside="Anyone interested in learning and building. Each piece is written for one of these first." />
        <ul className="m-0 grid list-none gap-px overflow-hidden rounded-[28px] border border-line bg-line p-0 min-[861px]:grid-cols-4">
          {audiences.map((item, index) => (
            <Reveal as="li" key={item.name} delay={index * 80} className="flex flex-col gap-2 bg-cloud p-7">
              <span className="text-[20px] font-extrabold leading-[1.2] tracking-[-0.02em]">{item.name}</span>
              <span className="text-[15px] leading-[1.5] text-muted">{item.interests}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* IS / IS NOT */}
      <section aria-labelledby="is-h" className={wrap}>
        <SectionHead id="is-h" title="What this is, and isn't" />
        <div className="grid gap-5 min-[861px]:grid-cols-2">
          <Reveal className="flex flex-col gap-5 rounded-[28px] bg-ink p-8 text-cloud min-[861px]:p-10">
            <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.1em] text-saffron">The Chaithanya is</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[18px] font-semibold leading-[1.45]">
              {brandIs.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full bg-saffron" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={90} className="flex flex-col gap-5 rounded-[28px] border-2 border-dashed border-line-strong p-8 min-[861px]:p-10">
            <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted">It is not</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[18px] font-semibold leading-[1.45] text-body">
              {brandIsNot.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.1em] shrink-0 font-mono text-muted" aria-hidden="true">
                    ×
                  </span>
                  <span className="line-through decoration-muted decoration-2">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Journey: honest, only what's true today */}
      <section aria-labelledby="jr-h" className={wrap}>
        <div className="flex flex-col gap-6 rounded-[32px] border border-line bg-white p-8 min-[861px]:flex-row min-[861px]:items-end min-[861px]:justify-between min-[861px]:p-12">
          <div className="flex max-w-[60ch] flex-col gap-4">
            <h2 id="jr-h" className="m-0 text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              The journey so far
            </h2>
            <p className="m-0 text-[18px] leading-[1.6] text-body">
              It&apos;s early — that&apos;s the point. Every experiment, project and lesson gets written down as it happens, so the
              record builds in public. Start with the latest insights, or follow along by email.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/insights" size="lg">
              Read insights
            </Button>
            <Button href="/newsletter" variant="outline" size="lg">
              Get the newsletter
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
