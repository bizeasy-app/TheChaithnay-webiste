'use client';

import { useEffect } from 'react';

/**
 * Magnetic buttons: anything with data-magnetic leans toward the pointer
 * (strength via data-magnetic="0.3") and springs back on leave. One shared
 * listener; fine pointers only; off for reduced motion.
 */
export function MagneticField() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    let active: HTMLElement | null = null;
    let frame = 0;
    let px = 0;
    let py = 0;

    const release = () => {
      if (!active) return;
      active.classList.remove('is-magnet');
      active.style.translate = '';
      active = null;
    };

    const apply = () => {
      frame = 0;
      if (!active) return;
      const box = active.getBoundingClientRect();
      const strength = Number(active.dataset.magnetic) || 0.28;
      const dx = px - (box.left + box.width / 2);
      const dy = py - (box.top + box.height / 2);
      // Undo the current offset so the pull doesn't compound.
      const [cx, cy] = (active.style.translate || '0px 0px').split(' ').map((v) => parseFloat(v) || 0);
      active.style.translate = `${((dx + cx) * strength).toFixed(1)}px ${((dy + cy) * strength).toFixed(1)}px`;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      px = event.clientX;
      py = event.clientY;
      const target = (event.target as HTMLElement | null)?.closest?.('[data-magnetic]') as HTMLElement | null;
      if (target !== active) {
        release();
        if (target) {
          active = target;
          active.classList.add('is-magnet');
        }
      }
      if (active && !frame) frame = window.requestAnimationFrame(apply);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', release);
    window.addEventListener('scroll', release, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', release);
      window.removeEventListener('scroll', release);
      window.cancelAnimationFrame(frame);
      release();
    };
  }, []);

  return null;
}
