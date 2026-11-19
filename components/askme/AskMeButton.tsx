'use client';

import { useEffect, useState } from 'react';
import { BinduMark } from '@/components/brand/BinduMark';
import { Magnetic } from '@/components/motion/Magnetic';

export function AskMeButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setFooterInView(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const hidden = footerInView && !open;

  return (
    <Magnetic
      className={`fixed bottom-6 right-6 z-40 transition duration-300 ${
        hidden ? 'pointer-events-none scale-95 opacity-0' : 'opacity-100'
      }`}
      strength={0.28}
    >
      <button
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="ask-me"
        aria-hidden={hidden}
        tabIndex={hidden ? -1 : 0}
        className="focus-on-ink float-fab press inline-flex min-h-11 items-center gap-2.5 rounded-full bg-ink px-4 py-3 text-[15px] font-bold text-cloud shadow-float transition duration-300 hover:scale-[1.03]"
      >
        <BinduMark size={22} tone="cloud" />
        Ask me anything
      </button>
    </Magnetic>
  );
}
