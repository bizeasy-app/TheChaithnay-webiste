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
    'Who is Chaithanya? A builder who learns in public: new technology tried first, real things built with it, and every result shared, including what broke.',
  path: '/about',
});

const wrap = 'mx-auto w-full max-w-page px-5 pt-20 min-[861px]:pt-28 max-[480px]:px-4';

export default function AboutPage() {
  return (
    <>
      <PageHero
        id="about-h"
        label="About"
        lines={["Hi, I'm", 'Chaithanya']}
        intro={
          <>
            I learn in public. I try new technology before it&apos;s obvious, build real things with it, and write down what
            happened, including the parts that broke. You get the shortcut.
          </>
        }
      />

      {/* Origin: why a dot, and why no face */}
      <section aria-labelledby="who-h" className={wrap}>
        <div className="grid gap-5 min-[961px]:grid-cols-2">
          <Reveal className="flex flex-col gap-6 rounded-[32px] bg-indigo p-8 text-paper min-[861px]:p-12">
            <BinduMark size={56} tone="paper" />
            <h2 id="who-h" className="m-0 text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Why a dot?
            </h2>
            <p className="m-0 max-w-[48ch] text-[18px] leading-[1.6] text-on-indigo-soft">
              Chaithanya means awareness. My logo is a dot inside a C: the moment you notice something worth trying. Every
              article, video and project here starts at that dot.
            </p>
          </Reveal>
          <Reveal delay={90} className="flex flex-col gap-6 rounded-[32px] border border-line bg-white p-8 min-[861px]:p-12">
            <h2 className="m-0 text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]">No face. Real work.</h2>
            <p className="m-0 max-w-[48ch] text-[18px] leading-[1.6] text-body">
              You won&apos;t see my face, but you&apos;ll hear my real voice, see my real screen and read about real experiments:
              what I tried, what happened and what I&apos;d do differently. No recycled AI news. No borrowed opinions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The promise */}
      <section aria-labelledby="get-h" className={wrap}>
        <SectionHead id="get-h" title="What you get from me" aside="Every article, video and email tries to give you at least one of these." />
        <ul className="m-0 grid list-none gap-px overflow-hidden rounded-[28px] border border-line bg-line p-0 min-[861px]:grid-cols-2">
          {brand.promise.map((item, index) => (
            <Reveal as="li" key={item} delay={index * 70} className="flex items-center gap-4 bg-cloud p-7 min-[861px]:p-9">
              <span className="h-3 w-3 shrink-0 rounded-full bg-saffron" aria-hidden="true" />
              <span className="text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.15] tracking-[-0.03em]">{item}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Philosophy */}
      <section aria-labelledby="phil-h" className={wrap}>
        <SectionHead id="phil-h" title="How I decide what to make" aside="When two good things pull apart, this is the side I take." />
        <ul className="m-0 flex list-none flex-col p-0">
          {principles.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 70} className="row-wipe grid gap-2 border-t border-line py-7 min-[861px]:grid-cols-[1fr_1fr] min-[861px]:items-baseline">
              <span className="text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.05] tracking-[-0.035em]">{item.title}</span>
              <span className="text-[18px] leading-[1.5] text-body">{item.body}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Interests */}
      <section aria-labelledby="int-h" className={wrap}>
        <SectionHead id="int-h" title="What I explore" aside="Four subjects. Everything I make sits in one of them." />
        <ul className="m-0 grid list-none gap-5 p-0 min-[640px]:grid-cols-2">
          {topics.map((topic, index) => (
            <Reveal as="li" key={topic.slug} delay={(index % 2) * 90} className="lift flex flex-col gap-4 rounded-[28px] border border-line bg-white p-8">
              <span className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em]">{topic.label}</span>
              <span className="text-[17px] leading-[1.55] text-body">{topic.blurb}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Who it's for */}
      <section aria-labelledby="aud-h" className={wrap}>
        <SectionHead id="aud-h" title="Who I write for" aside="If you would rather build than just read the news, you are in the right place." />
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
        <SectionHead id="is-h" title="What this is, and what it will never be" />
        <div className="grid gap-5 min-[861px]:grid-cols-2">
          <Reveal className="flex flex-col gap-5 rounded-[28px] bg-ink p-8 text-cloud min-[861px]:p-10">
            <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.1em] text-saffron">This is</p>
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
            <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted">This will never be</p>
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
              It&apos;s early. That&apos;s the point.
            </h2>
            <p className="m-0 text-[18px] leading-[1.6] text-body">
              This record starts at week one. Every experiment, project and lesson gets written down as it happens, so you can
              learn from my mistakes before you make them. Start reading, or get it by email every two weeks.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/insights" size="lg">
              Start reading
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
