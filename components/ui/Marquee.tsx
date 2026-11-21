'use client';

import { useEffect, useRef } from 'react';

type MarqueeProps = {
  items: string[];
  paused?: boolean;
  /** Base speed in px per second. */
  speed?: number;
};

/**
 * Scroll-reactive marquee: drifts on its own, speeds up and leans with scroll
 * velocity, and follows the scroll direction. Static under reduced motion.
 */
export function Marquee({ items, paused = false, speed = 70 }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let last = performance.now();
    let x = 0;
    let dir = 1;
    let boost = 0;
    let skew = 0;
    let lastScroll = window.scrollY;

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const scroll = window.scrollY;
      const velocity = window.__lenis?.velocity ?? (scroll - lastScroll) / Math.max(dt * 60, 1);
      lastScroll = scroll;
      if (Math.abs(velocity) > 0.4) dir = velocity > 0 ? 1 : -1;

      const target = Math.min(Math.abs(velocity) * 0.35, 7);
      boost += (target - boost) * 0.08;
      const targetSkew = pausedRef.current ? 0 : Math.max(Math.min(velocity * 0.35, 7), -7);
      skew += (targetSkew - skew) * 0.1;

      const half = track.scrollWidth / 2;
      if (!pausedRef.current && half > 0) {
        x -= dir * speed * (1 + boost) * dt;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${(-skew).toFixed(2)}deg)`;
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [speed]);

  const sequence = items.flatMap((item, index) => [
    <span key={`${item}-${index}`}>{item}</span>,
    <span key={`${item}-${index}-dot`} className="text-saffron">
      ●
    </span>,
  ]);

  return (
    <div aria-hidden="true" className="ml-[-2%] w-[104%] overflow-hidden bg-ink py-[22px] text-cloud [transform:rotate(-1.2deg)]">
      <div ref={trackRef} className="flex w-max whitespace-nowrap text-[28px] font-extrabold tracking-[-0.02em] will-change-transform">
        <span className="flex gap-10 pr-10">{sequence}</span>
        <span className="flex gap-10 pr-10">{sequence}</span>
      </div>
    </div>
  );
}
