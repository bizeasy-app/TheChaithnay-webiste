import { Reveal } from '@/components/motion/Reveal';
import { series } from '@/lib/brand';

/** The six signature series, as a compact list under the Insights feed. */
export function SeriesList() {
  return (
    <section aria-labelledby="series-h" className="mt-16">
      <h2 id="series-h" className="m-0 mb-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted">
        Signature series
      </h2>
      <ul className="m-0 flex list-none flex-col p-0">
        {series.map((item, index) => (
          <Reveal
            as="li"
            key={item.slug}
            delay={index * 60}
            className="row-wipe group flex items-baseline justify-between gap-6 border-t border-line py-5 last:border-b"
          >
            <span className="flex items-baseline gap-4">
              <span className="font-mono text-[12px] font-medium text-muted">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-[22px] font-extrabold tracking-[-0.025em]">
                {item.name}
                <span className="text-saffron">.</span>
              </span>
            </span>
            <span className="text-right text-[14px] leading-[1.45] text-muted">{item.body}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
