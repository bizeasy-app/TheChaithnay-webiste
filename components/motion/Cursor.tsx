'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE = 'a, button, [role="button"], summary, label, select';
const TEXT_FIELDS = 'input, textarea, [contenteditable="true"]';

type Surface = 'light' | 'dark' | 'accent';

/** Parse rgb()/rgba() or color(srgb …) into 0–255 channels plus alpha. */
function parseColor(value: string): [number, number, number, number] | null {
  const rgb = value.match(/rgba?\(([\d.]+),?\s*([\d.]+),?\s*([\d.]+)(?:[,/]\s*([\d.]+))?/);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3]), rgb[4] === undefined ? 1 : Number(rgb[4])];
  const srgb = value.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/);
  if (srgb) return [Number(srgb[1]) * 255, Number(srgb[2]) * 255, Number(srgb[3]) * 255, srgb[4] === undefined ? 1 : Number(srgb[4])];
  return null;
}

/** First solid background up the tree, read as light / dark / saffron. */
function readSurface(start: Element | null): Surface {
  let el: Element | null = start;
  while (el && el !== document.documentElement) {
    const color = parseColor(getComputedStyle(el).backgroundColor);
    if (color) {
      const [r, g, b, alpha] = color;
      if (alpha >= 0.5) {
        if (r > 200 && g > 90 && g < 150 && b < 80) return 'accent';
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return luminance > 0.55 ? 'light' : 'dark';
      }
    }
    el = el.parentElement;
  }
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/**
 * Dot cursor for fine pointers. The dot tracks the pointer exactly; a ring
 * follows with lag, grows over links, and shows a label from data-cursor
 * ("Play", "Read", …). Hidden over text fields so the I-beam stays usable.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const root = document.documentElement;
    root.classList.add('has-cursor');

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let frame = 0;
    let shown = false;
    let lastTarget: Element | null = null;
    // Surfaces only change with the theme, so cache per element until it flips.
    let cache = new WeakMap<Element, Surface>();
    const setSurface = (surface: Surface) => {
      if (ring.dataset.surface === surface) return;
      ring.dataset.surface = surface;
      dot.dataset.surface = surface;
    };
    const themeWatch = new MutationObserver(() => {
      cache = new WeakMap();
      if (lastTarget) setSurface(readSurface(lastTarget));
    });
    themeWatch.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    const tick = () => {
      frame = window.requestAnimationFrame(tick);
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      if (!shown) {
        rx = x;
        ry = y;
        shown = true;
        root.classList.add('cursor-on');
      }

      update(event.target as HTMLElement | null);
    };

    // Content can move under a still pointer (scroll, route change): re-check.
    const update = (target: HTMLElement | null) => {
      const overText = Boolean(target?.closest?.(TEXT_FIELDS));
      const labelled = target?.closest?.('[data-cursor]') as HTMLElement | null;
      const interactive = Boolean(target?.closest?.(INTERACTIVE));
      const text = labelled?.dataset.cursor ?? '';

      root.classList.toggle('cursor-text', overText);
      ring.classList.toggle('is-link', interactive && !text);
      ring.classList.toggle('is-label', Boolean(text));
      if (label.textContent !== text) label.textContent = text;

      if (target && target !== lastTarget) {
        lastTarget = target;
        let surface = cache.get(target);
        if (!surface) {
          surface = readSurface(target);
          cache.set(target, surface);
        }
        setSurface(surface);
      }
    };

    let scrollFrame = 0;
    const onScroll = () => {
      if (!shown || scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        update(document.elementFromPoint(x, y) as HTMLElement | null);
      });
    };

    const onLeave = () => {
      shown = false;
      root.classList.remove('cursor-on');
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerup', onUp);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      themeWatch.disconnect();
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(scrollFrame);
      root.classList.remove('has-cursor', 'cursor-on', 'cursor-text');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
