import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/Button';
import { EmailForm } from '@/components/ui/EmailForm';
import { newsletterJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Newsletter | The Chaithanya',
  description:
    'One free email every two weeks with four things: something to learn, something to try, something to understand and one honest lesson from building.',
  path: '/newsletter',
});

const points: [string, string][] = [
  ['Learn', 'one tool, idea or skill, explained simply'],
  ['Try', 'one thing you can use the same day'],
  ['Understand', 'what is actually changing in tech and business'],
  ['Think', 'one honest lesson from building'],
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
              Free, every two weeks
            </p>
            <h1 id="nl-h" className="m-0 text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              One email.
              <br />
              <span className="text-saffron">Four things worth your time.</span>
            </h1>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[18px] font-semibold text-on-indigo-soft">
              {points.map(([verb, rest]) => (
                <li key={verb} className="flex items-baseline gap-3">
                  <span className="h-2 w-2 shrink-0 translate-y-[-2px] rounded-full bg-saffron" aria-hidden="true" />
                  <span>
                    <strong className="font-extrabold text-paper">{verb}:</strong> {rest}
                  </span>
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
          </h2>
        </div>
        <div className="flex flex-col items-start gap-5 rounded-[28px] border-2 border-dashed border-line-strong p-8 min-[861px]:p-12">
          <p className="m-0 max-w-[30ch] text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.15] tracking-[-0.03em]">
            Issue #1 hasn&apos;t gone out yet.
          </p>
          <p className="m-0 max-w-[56ch] text-[18px] leading-[1.55] text-body">
            Subscribe now and it&apos;s the first email you get. Every issue will be archived here. Until then, a new article
            goes up on Insights every week.
          </p>
          <Button href="/insights" variant="outline">
            Start reading
          </Button>
        </div>
      </section>
    </>
  );
}
