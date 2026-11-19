'use client';

import { useEffect, useState } from 'react';
import { BinduMark } from '@/components/brand/BinduMark';

const KEY = 'tc-intro-seen';

export function PageIntro() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {
      /* ignore */
    }

    setOpen(true);
    const leave = window.setTimeout(() => setLeaving(true), 820);
    const done = window.setTimeout(() => {
      setOpen(false);
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* ignore */
      }
    }, 1480);

    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
    };
  }, []);

  if (!open) return null;

  return (
    <div className={`page-intro fixed inset-0 z-[80]${leaving ? ' is-leaving' : ''}`} aria-hidden="true">
      <div className="page-intro-panel absolute inset-0 flex items-center justify-center bg-ink text-cloud">
        <div className="page-intro-mark flex flex-col items-center gap-5">
          <BinduMark size={72} tone="cloud" blink />
          <span className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-muted-dark">Try new.</span>
        </div>
      </div>
    </div>
  );
}
