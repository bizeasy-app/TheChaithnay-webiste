import type { Metadata } from 'next';
import { PageHero, SectionHead, SoonCard } from '@/components/page/PageHero';
import { EmailForm } from '@/components/ui/EmailForm';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Resources | The Chaithanya',
  description: 'Tools, templates and guides from real experiments with AI, business and productivity. The first resources open here soon.',
  path: '/resources',
});

const shelves = [
  { title: 'Tools', body: 'The AI tools and software I actually use, with honest notes on what each one is good for.' },
  { title: 'Templates', body: 'Notion templates, prompts and checklists from my own workflows — copy and adapt.' },
  { title: 'Guides', body: 'Step-by-step guides that turn a long experiment into something you can follow in an afternoon.' },
  { title: 'Recommended', body: 'Books, courses, newsletters and channels that changed how I think or build.' },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        id="res-h"
        label="Resources · Being built"
        lines={['Things you', 'can use']}
        intro="Everything here comes out of real work: if I haven't used it, it doesn't go on the shelf. The first resources open soon."
      >
        <EmailForm source="newsletter" tag="resources-launch" layout="pill" label="Tell me when they're ready" buttonLabel="Notify me" />
      </PageHero>

      <section aria-labelledby="shelf-h" className="mx-auto w-full max-w-page px-5 pt-20 min-[861px]:pt-28 max-[480px]:px-4">
        <SectionHead id="shelf-h" title="On the shelf soon" aside="Four kinds of resources. Nothing is listed until it's real." />
        <ul className="m-0 grid list-none gap-5 p-0 min-[640px]:grid-cols-2">
          {shelves.map((item, index) => (
            <SoonCard key={item.title} title={item.title} body={item.body} index={index} />
          ))}
        </ul>
      </section>
    </>
  );
}
