import type { Metadata } from 'next';
import { ContactSection } from '@/components/newsletter/ContactSection';
import { EmailForm } from '@/components/ui/EmailForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { newsletterJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'The weekly founder log newsletter | The Chaithanya',
  description: 'One email every Saturday: what I tried, what happened, and one AI tool or system you can steal. Free.',
  path: '/newsletter',
});

const points = [
  'What I tried this week, and what happened',
  'One AI tool or system you can steal',
  'Every Saturday. No hype, no spam.',
];

export default function NewsletterPage() {
  return (
    <>
      <JsonLd data={newsletterJsonLd()} />
      <section aria-labelledby="nl-h" className="mx-auto w-full max-w-page px-5 pt-8 max-[480px]:px-4">
        <div className="flex flex-wrap items-center gap-12 rounded-[28px] bg-ink px-6 py-12 text-cloud min-[861px]:px-14 min-[861px]:py-[72px]">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5">
            <p className="m-0 flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.08em] text-muted-dark">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-saffron" aria-hidden="true" />
              The weekly founder log
            </p>
            <h1 id="nl-h" className="m-0 text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Learn what I learn,
              <br />
              <span className="text-saffron">a week early.</span>
            </h1>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[18px] font-semibold text-[#D9D2C9]">
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

      <ContactSection />
    </>
  );
}
