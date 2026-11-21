import Link from 'next/link';
import { LineReveal } from '@/components/home/LineReveal';
import { Reveal } from '@/components/motion/Reveal';
import { topics } from '@/lib/topics';

/** The four content pillars, each linking to its Insights filter. */
export function Pillars() {
  return (
    <section aria-labelledby="pillars-h" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-32 max-[480px]:px-4">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <LineReveal
          id="pillars-h"
          className="m-0 text-[clamp(40px,5.4vw,72px)] font-extrabold leading-[0.98] tracking-[-0.045em]"
          lines={[{ text: 'What you' }, { text: 'will find here' }]}
        />
      </div>
      <ul className="m-0 grid list-none gap-4 p-0 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-4">
        {topics.map((topic, index) => (
          <Reveal as="li" key={topic.slug} delay={index * 70}>
            <Link
              href={`/insights?topic=${topic.slug}`}
              data-cursor="Read"
              className="lift ink-wash group flex h-full min-h-[220px] flex-col justify-end gap-6 rounded-[28px] border border-line bg-white p-7 text-ink no-underline"
            >
              <span className="flex flex-col gap-3">
                <span className="text-[26px] font-extrabold leading-[1.08] tracking-[-0.03em]">{topic.label}</span>
                <span className="text-[15px] leading-[1.5] text-body">{topic.blurb}</span>
                <span className="text-[15px] font-extrabold underline decoration-saffron decoration-2 underline-offset-4">
                  Read {topic.short}
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
