'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * One rAF loop for every scroll-linked effect on the page.
 *
 *   data-speed="0.2"     vertical parallax; positive drifts up faster than the page
 *   data-drift-x="-60"   horizontal drift in px per viewport of travel (headline lines)
 *   data-progress        writes --p (0 → 1) as the element enters the viewport
 *   data-progress="end"  --p measured against the end of the document (sticky footer)
 *   data-fx-all          also run on screens under 861px (desktop-only by default)
 *
 * Positions are measured from the untransformed box, so the loop never feeds back
 * on its own output. Reduced motion: nothing moves and --p is pinned to 1.
 */

type Item = {
  el: HTMLElement;
  speed: number;
  driftX: number;
  progress: '' | 'enter' | 'end';
  all: boolean;
  ty: number;
  tx: number;
  p: number;
};

const DESKTOP = 861;

function collect(): Item[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-speed],[data-drift-x],[data-progress]')).map((el) => {
    const progress = el.dataset.progress;
    return {
      el,
      speed: Number.parseFloat(el.dataset.speed ?? '0') || 0,
      driftX: Number.parseFloat(el.dataset.driftX ?? '0') || 0,
      progress: progress === undefined ? '' : progress === 'end' ? 'end' : 'enter',
      all: el.hasAttribute('data-fx-all'),
      ty: 0,
      tx: 0,
      p: -1,
    };
  });
}

export function ScrollFX() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let items = collect();

    if (reduce.matches) {
      items.forEach((item) => item.progress && item.el.style.setProperty('--p', '1'));
      return;
    }

    let frame = 0;
    let lastY = -1;
    let lastW = -1;
    let lastH = -1;
    let dirty = true;

    const tick = () => {
      frame = window.requestAnimationFrame(tick);
      const y = window.scrollY;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (!dirty && y === lastY && vw === lastW && vh === lastH) return;
      dirty = false;
      lastY = y;
      lastW = vw;
      lastH = vh;

      const desktop = vw >= DESKTOP;
      const maxScroll = Math.max(document.documentElement.scrollHeight - vh, 1);

      for (const item of items) {
        const { el } = item;
        const active = desktop || item.all;

        if (item.speed || item.driftX) {
          let tx = 0;
          let ty = 0;
          if (active) {
            const box = el.getBoundingClientRect();
            const naturalTop = box.top - item.ty;
            if (naturalTop < vh * 1.6 && naturalTop + box.height > -vh * 0.6) {
              const delta = naturalTop + box.height / 2 - vh / 2;
              ty = -delta * item.speed;
              tx = (delta / vh) * item.driftX;
            } else {
              tx = item.tx;
              ty = item.ty;
            }
          }
          if (Math.abs(tx - item.tx) > 0.05 || Math.abs(ty - item.ty) > 0.05) {
            item.tx = tx;
            item.ty = ty;
            el.style.transform = tx || ty ? `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)` : '';
          }
        }

        if (item.progress) {
          let p: number;
          if (item.progress === 'end') {
            p = 1 - (maxScroll - y) / Math.max(el.offsetHeight, 1);
          } else {
            const top = el.getBoundingClientRect().top - item.ty;
            p = (vh - top) / (vh * 0.7);
          }
          p = Math.min(Math.max(p, 0), 1);
          if (Math.abs(p - item.p) > 0.001) {
            item.p = p;
            el.style.setProperty('--p', p.toFixed(4));
          }
        }
      }
    };

    // Re-scan when client components mount late or content changes height.
    const rescan = window.setTimeout(() => {
      items = collect();
      dirty = true;
    }, 400);
    const onResize = () => {
      dirty = true;
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);
    window.addEventListener('resize', onResize);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(rescan);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
      items.forEach((item) => {
        item.el.style.transform = '';
        item.el.style.removeProperty('--p');
      });
    };
  }, [pathname]);

  return null;
}
