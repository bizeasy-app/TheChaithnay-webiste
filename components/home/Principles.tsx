import { Reveal } from '@/components/motion/Reveal';
import { principles } from '@/lib/brand';

/**
 * The five principles as "X over Y" type, nothing else: what I choose stays
 * solid, what I choose it over is struck through as it scrolls in.
 */
export function Principles() {
  return (
    <section aria-labelledby="principles-h" className="mx-auto w-full max-w-page px-5 pt-20 min-[861px]:pt-36 max-[480px]:px-4">
      <h2 id="principles-h" className="m-0 mb-8 text-[clamp(40px,5.4vw,72px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
        How I work
      </h2>
      <ul className="m-0 list-none border-t border-line-strong p-0">
        {principles.map((item) => {
          const [choice, rest] = item.title.split(' over ');
          return (
            <Reveal as="li" key={item.title} className="principle border-b border-line-strong py-6">
              <p className="m-0 text-[clamp(30px,4.4vw,60px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
                <span className="text-ink">{choice}</span> <span className="text-placeholder">over</span>{' '}
                <span className="principle-strike text-placeholder">{rest}</span>
              </p>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
