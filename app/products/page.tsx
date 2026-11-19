import type { Metadata } from 'next';
import { HowIBuild } from '@/components/products/HowIBuild';
import { IdeaBox } from '@/components/products/IdeaBox';
import { LabBento } from '@/components/products/LabBento';
import { EmailForm } from '@/components/ui/EmailForm';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Products & experiments | The Chaithanya',
  description: "What I'm building with AI, in public. The first products open here soon — get notified when they launch.",
  path: '/products',
});

export default function ProductsPage() {
  return (
    <>
      <section aria-labelledby="products-h" className="mx-auto flex w-full max-w-page flex-col gap-8 px-5 pt-16 min-[861px]:pt-[88px] max-[480px]:px-4">
        <SectionLabel blink className="tracking-[0.1em]">
          The lab · Building in public
        </SectionLabel>
        <h1 id="products-h" className="m-0 text-[clamp(56px,9.6vw,150px)] font-extrabold leading-[0.92] tracking-[-0.055em]">
          Products
          <br />
          &amp; experiments<span className="text-saffron">.</span>
        </h1>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="m-0 max-w-[520px] flex-[1_1_380px] text-[21px] font-medium leading-normal text-body">
            Everything I build, shown honestly — what works, what breaks, what&apos;s next. The first products open here soon.
          </p>
          <div className="min-w-0 flex-[1_1_440px]">
            <EmailForm source="products" tag="product-launch" layout="pill" label="Be first to see the launches" buttonLabel="Notify me" />
          </div>
        </div>
      </section>
      <LabBento />
      <HowIBuild />
      <IdeaBox />
    </>
  );
}
