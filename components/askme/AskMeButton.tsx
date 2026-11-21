'use client';

import { useEffect, useState } from 'react';
import { BinduMark } from '@/components/brand/BinduMark';
import { ArrowUpRight } from '@/components/social/icons';

function toTop() {
  const lenis = (window as Window & { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('content')?.focus({ preventScroll: true });
}

/**
 * Bottom-right corner pill: a back-to-top circle whose ring fills with page
 * scroll (slides in once you've scrolled), then the Ask me button. At the
 * footer the Ask part tucks away and only "back to top" stays.
 */
export function AskMeButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    // The footer is a sticky curtain behind #content, so it always "intersects".
    // It is revealed once the bottom of #content rises into the viewport.
    const content = document.getElementById('content');
    if (!content) return;

    let frame = 0;
    const check = () => {
      frame = 0;
      setFooterInView(content.getBoundingClientRect().bottom < window.innerHeight * 0.85);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const askHidden = footerInView && !open;

  return (
    <div className="ask-fab corner corner-br" data-ask-hidden={askHidden} style={{ ['--corner-i' as string]: 3 }}>
      <div className="corner-pill flex items-center p-1.5">
        <div className="corner-top-slot">
          <div>
            <button
              type="button"
              aria-label="Back to top"
              data-cursor="Top"
              onClick={toTop}
              className="scroll-ring press relative mr-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink min-[861px]:h-12 min-[861px]:w-12"
            >
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="29" fill="none" className="scroll-ring-track" strokeWidth="2.5" />
                <circle cx="32" cy="32" r="29" fill="none" className="scroll-ring-fill" strokeWidth="2.5" pathLength={1} />
              </svg>
              <span className="scroll-ring-arrow inline-flex">
                <ArrowUpRight size={18} />
              </span>
            </button>
          </div>
        </div>
        <div className="corner-ask-slot">
          <div>
            <button
              type="button"
              onClick={onClick}
              data-magnetic="0.25"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="ask-me"
              aria-hidden={askHidden}
              tabIndex={askHidden ? -1 : 0}
              className="focus-on-ink press inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-ink pl-2.5 pr-4 text-[15px] font-bold text-cloud min-[861px]:h-12 min-[861px]:pr-5"
            >
              <span className="ask-bindu inline-flex">
                <BinduMark size={22} tone="cloud" />
              </span>
              <span>
                Ask me<span className="max-[860px]:hidden"> anything</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
