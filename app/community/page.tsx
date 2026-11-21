import type { Metadata } from 'next';
import { PageHero, SectionHead, SoonCard } from '@/components/page/PageHero';
import { Button } from '@/components/ui/Button';
import { EmailForm } from '@/components/ui/EmailForm';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Community | The Chaithanya',
  description: 'A small community for people who learn by building: honest feedback, shared experiments and short learning challenges. Opening soon.',
  path: '/community',
});

const plans = [
  { title: 'Discussions', body: 'Ask questions, share what you are building, and get honest feedback from people doing the same.' },
  { title: 'Build together', body: 'Experiments readers suggest, run in public, with results shared back to everyone.' },
  { title: 'Learning initiatives', body: 'Small, focused challenges to learn a tool or skill together in a few weeks.' },
];

export default function CommunityPage() {
  return (
    <>
      <PageHero
        id="com-h"
        label="Opening soon"
        lines={['Learn and build,', 'together']}
        intro="A small room for people who learn by building. It isn't open yet. Join the list and you'll get the first invite."
      >
        <EmailForm source="newsletter" tag="community-launch" layout="pill" label="Get the first invite" buttonLabel="Join the list" />
      </PageHero>

      <section aria-labelledby="plan-h" className="mx-auto w-full max-w-page px-5 pt-20 min-[861px]:pt-28 max-[480px]:px-4">
        <SectionHead id="plan-h" title="What it will be" aside="Built around people helping people, not follower counts." />
        <ul className="m-0 grid list-none gap-5 p-0 min-[861px]:grid-cols-3">
          {plans.map((item, index) => (
            <SoonCard key={item.title} title={item.title} body={item.body} index={index} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="now-h" className="mx-auto w-full max-w-page px-5 pt-20 min-[861px]:pt-28 max-[480px]:px-4">
        <div className="flex flex-col gap-6 rounded-[32px] bg-saffron p-8 text-coal min-[861px]:flex-row min-[861px]:items-end min-[861px]:justify-between min-[861px]:p-12">
          <div className="flex max-w-[52ch] flex-col gap-3">
            <h2 id="now-h" className="m-0 text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Until then, talk to me.
            </h2>
            <p className="m-0 text-[18px] font-medium leading-[1.55]">
              Suggest an experiment, ask a question, or tell me what you&apos;re building. I read every message.
            </p>
          </div>
          <Button href="/contact" size="lg" className="!border-coal !bg-coal !text-paper">
            Send a message
          </Button>
        </div>
      </section>
    </>
  );
}
