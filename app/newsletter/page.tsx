import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/Button';
import { EmailForm } from '@/components/ui/EmailForm';
import { newsletterJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Newsletter | The Chaithanya',
  description:
    'One email every two weeks: original insights on technology, AI, business and productivity, plus what I learned from real experiments. Free.',
  path: '/newsletter',
});

const points = [
  'Original insights you won’t find on my socials',
  'What I tried, what happened, what I learned',
  'One email every two weeks. No hype, no spam.',
];

export default function NewsletterPage() {
  return (
    <>
      <JsonLd data={newsletterJsonLd()} />
      <section aria-labelledby="nl-h" className="mx-auto w-full max-w-page px-5 pt-8 max-[480px]:px-4">
        <div className="flex flex-wrap items-center gap-12 rounded-[28px] bg-indigo px-6 py-12 text-paper min-[861px]:px-14 min-[861px]:py-[72px]">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5">
            <p className="m-0 flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.08em] text-on-indigo">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-saffron" aria-hidden="true" />
              The Chaithanya newsletter
            </p>
            <h1 id="nl-h" className="m-0 text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Learn what I learn,
              <br />
              <span className="text-saffron">straight to your inbox.</span>
            </h1>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[18px] font-semibold text-on-indigo-soft">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-saffron" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 flex-[1_1_380px] rounded-[22px] bg-ink-2 p-8">
            <EmailForm source="newsletter" layout="card" />
          </div>
        </div>
      </section>

      <section aria-labelledby="issues-h" className="mx-auto w-full max-w-page px-5 pt-20 min-[861px]:pt-28 max-[480px]:px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <h2 id="issues-h" className="m-0 flex items-baseline gap-3 text-[clamp(40px,6vw,80px)] font-extrabold leading-[0.95] tracking-[-0.05em]">
            Previous issues
            <span className="font-mono text-[15px] font-medium tracking-normal text-muted">00</span>
          </h2>
        </div>
        <div className="flex flex-col items-start gap-5 rounded-[28px] border-2 border-dashed border-line-strong p-8 min-[861px]:p-12">
          <p className="m-0 max-w-[30ch] text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.15] tracking-[-0.03em]">
            Issue #1 hasn&apos;t gone out yet.
          </p>
          <p className="m-0 max-w-[56ch] text-[18px] leading-[1.55] text-body">
            Past issues will be archived here. Subscribe above to get the first one — and in the meantime, the weekly articles
            are on Insights.
          </p>
          <Button href="/insights" variant="outline">
            Read insights →
          </Button>
        </div>
      </section>
    </>
  );
}
