'use client';

import { useEffect, useRef } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#/•';

/**
 * Label that decodes letter by letter when it scrolls into view, and again on
 * hover of its closest link/button. The real text is always in the DOM for
 * screen readers (aria-label) and for no-JS / reduced motion.
 */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const run = () => {
      window.cancelAnimationFrame(frame);
      const start = performance.now();
      const duration = 380 + text.length * 22;
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const settled = Math.floor(t * text.length);
        let out = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          out += i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        node.textContent = out;
        if (t < 1) frame = window.requestAnimationFrame(step);
      };
      frame = window.requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        run();
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(node);

    const host = node.closest('a, button') ?? node.parentElement;
    host?.addEventListener('pointerenter', run);

    return () => {
      window.cancelAnimationFrame(frame);
      io.disconnect();
      host?.removeEventListener('pointerenter', run);
      node.textContent = text;
    };
  }, [text]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className="scramble">
        {text}
      </span>
    </span>
  );
}
