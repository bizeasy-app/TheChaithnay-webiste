import { BinduMark } from '@/components/brand/BinduMark';
import { LineReveal } from '@/components/home/LineReveal';
import { Reveal } from '@/components/motion/Reveal';
import { EmailForm } from '@/components/ui/EmailForm';

export function EndCTA() {
  return (
    <section aria-labelledby="end-h" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-32 max-[480px]:px-4">
      <div data-progress data-fx-all>
      <Reveal className="grow-in relative flex flex-col gap-7 overflow-hidden rounded-[36px] bg-ink px-6 py-12 text-cloud [background-image:radial-gradient(rgba(240,238,233,0.08)_1.5px,transparent_1.5px)] [background-size:24px_24px] min-[861px]:px-14 min-[861px]:py-20">
        <BinduMark
          size={520}
          tone="cloud"
          className="drift spin pointer-events-none absolute -right-[140px] -top-[90px] opacity-[0.18]"
        />
        <LineReveal
          id="end-h"
          className="relative m-0 max-w-[820px] text-[clamp(48px,7vw,96px)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          lines={[{ text: 'Learn with me,' }, { text: 'every ', accent: 'two weeks.' }]}
        />
        <div className="relative max-w-[560px]">
          <EmailForm source="home" />
        </div>
      </Reveal>
      </div>
    </section>
  );
}
