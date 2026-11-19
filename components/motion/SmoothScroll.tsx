'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

function syncScroll(scroll: number) {
  const root = document.documentElement;
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max(scroll / max, 0), 1);
  root.style.setProperty('--scroll', progress.toFixed(4));
  root.classList.toggle('is-scrolled', scroll > 28);
}

export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onPointerMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest?.('.ink-wash') as HTMLElement | null;
      if (!target) return;
      const box = target.getBoundingClientRect();
      if (!box.width || !box.height) return;
      target.style.setProperty('--mx', `${((event.clientX - box.left) / box.width) * 100}%`);
      target.style.setProperty('--my', `${((event.clientY - box.top) / box.height) * 100}%`);
    };
    document.addEventListener('pointermove', onPointerMove, { passive: true });

    if (reduce) {
      const onScroll = () => syncScroll(window.scrollY);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        document.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
        root.style.removeProperty('--scroll');
        root.classList.remove('is-scrolled');
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      touchMultiplier: 1.2,
      // Nested panels (Ask me) keep native scroll via data-lenis-prevent.
      prevent: (node) =>
        node.hasAttribute('data-lenis-prevent') ||
        Boolean(node.closest?.('[data-lenis-prevent]')),
    });

    lenis.on('scroll', ({ scroll }: { scroll: number }) => syncScroll(scroll));
    syncScroll(0);

    let frame = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    root.classList.add('smooth-scroll', 'lenis');
    window.__lenis = lenis;

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onPointerMove);
      root.classList.remove('smooth-scroll', 'is-scrolled');
      root.style.removeProperty('--scroll');
      delete window.__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}
