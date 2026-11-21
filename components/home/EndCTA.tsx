import { BinduMark } from '@/components/brand/BinduMark';
import { LineReveal } from '@/components/home/LineReveal';
import { Reveal } from '@/components/motion/Reveal';
import { EmailForm } from '@/components/ui/EmailForm';

const promise = [
  ['Learn', 'one tool, idea or skill, explained simply'],
  ['Try', 'one thing you can use the same day'],
  ['Understand', 'what is actually changing in tech and business'],
  ['Think', 'one honest lesson from building'],
];

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
          lines={[{ text: 'One email.' }, { text: 'Four things.' }]}
        />
        <ul className="relative m-0 grid max-w-[880px] list-none gap-x-10 gap-y-4 p-0 min-[700px]:grid-cols-2">
          {promise.map(([verb, rest]) => (
            <li key={verb} className="flex gap-3 text-[18px] leading-[1.45]">
              <span className="mt-[0.5em] h-2 w-2 shrink-0 rounded-full bg-saffron" aria-hidden="true" />
              <span>
                <strong className="font-extrabold">{verb}:</strong> <span className="opacity-80">{rest}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="relative max-w-[560px]">
          <EmailForm source="home" />
        </div>
      </Reveal>
      </div>
    </section>
  );
}
