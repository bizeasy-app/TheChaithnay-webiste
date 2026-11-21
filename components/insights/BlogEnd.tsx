import { BinduMark } from '@/components/brand/BinduMark';
import { EmailForm } from '@/components/ui/EmailForm';

export function BlogEnd() {
  return (
    <section aria-labelledby="blog-end-h" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-32 max-[480px]:px-4">
      <div className="relative flex flex-col gap-7 overflow-hidden rounded-[36px] bg-ink px-6 py-12 text-cloud [background-image:radial-gradient(rgba(240,238,233,0.08)_1.5px,transparent_1.5px)] [background-size:24px_24px] min-[861px]:px-14 min-[861px]:py-[72px]">
        <BinduMark size={480} tone="cloud" className="pointer-events-none absolute -right-[130px] -top-20 opacity-[0.18]" />
        <h2
          id="blog-end-h"
          className="relative m-0 max-w-[820px] text-[clamp(44px,6.4vw,88px)] font-extrabold leading-[0.95] tracking-[-0.05em]"
        >
          Learn what I learn.
          <br />
          <span className="text-saffron">Every two weeks.</span>
        </h2>
        <div className="relative max-w-[560px]">
          <EmailForm source="blog" label="The newsletter, every two weeks" />
        </div>
      </div>
    </section>
  );
}
