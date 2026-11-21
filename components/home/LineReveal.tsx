'use client';

import { useEffect, useRef, useState } from 'react';

type Line = {
  text: string;
  accent?: string;
  dot?: boolean;
  /** Horizontal scroll drift in px per viewport (desktop). */
  driftX?: number;
  /** Hand-drawn saffron underline that draws in after the words land. */
  scribble?: boolean;
};

function words(value: string) {
  return value.split(/(\s+)/).filter(Boolean);
}

export function LineReveal({
  id,
  as: Tag = 'h2',
  className,
  lines,
  spotlight = false,
}: {
  id?: string;
  as?: 'h1' | 'h2';
  className?: string;
  lines: Line[];
  /** Cycle a spotlight through the lines once revealed (others dim). */
  spotlight?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);
  const [spot, setSpot] = useState(-1);

  useEffect(() => {
    if (!spotlight || !shown) return;
    let index = -1;
    let timer = 0;
    const advance = () => {
      index = (index + 1) % lines.length;
      setSpot(index);
      window.dispatchEvent(new CustomEvent('tc:spotlight', { detail: index }));
    };
    const start = window.setTimeout(() => {
      advance();
      timer = window.setInterval(() => {
        if (!document.hidden) advance();
      }, 2600);
    }, 1400);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [spotlight, shown, lines.length]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let observer: IntersectionObserver | undefined;
    const reveal = () => {
      frame = window.requestAnimationFrame(() => setShown(true));
    };
    const watch = () => {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
        reveal();
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          reveal();
          observer?.disconnect();
        },
        { threshold: 0.28, rootMargin: '0px 0px -6% 0px' },
      );
      observer.observe(node);
    };

    setArmed(true);
    const fallback = window.setTimeout(reveal, 1800);
    document.fonts.ready.then(watch).catch(watch);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
      observer?.disconnect();
    };
  }, []);

  let wordIndex = 0;

  return (
    <Tag
      id={id}
      ref={ref}
      aria-label={lines.map((line) => `${line.text}${line.accent ?? ''}`.replace(/\s+/g, ' ').trim()).join(' ')}
      className={`mask-reveal${armed ? ' is-armed' : ''}${shown ? ' is-in' : ''}${spot >= 0 ? ' is-cycling' : ''} ${className ?? ''}`}
    >
      {lines.map((line, lineIndex) => (
        <span
          key={`${line.text}-${line.accent ?? ''}`}
          className={`mask-line${line.scribble ? ' has-scribble' : ''}${spot === lineIndex ? ' is-spot' : ''}`}
          data-drift-x={line.driftX || undefined}
          aria-hidden="true"
        >
          <span className={line.scribble ? 'relative inline-block' : undefined}>
          {words(line.text).map((part, index) => {
            if (/^\s+$/.test(part)) {
              return <span key={`s-${index}`}>{part}</span>;
            }
            const delay = wordIndex++ * 70;
            return (
              <span key={`${part}-${index}`} className="mask-word" style={{ transitionDelay: `${delay}ms` }}>
                {part}
              </span>
            );
          })}
          {line.accent
            ? words(line.accent).map((part, index) => {
                if (/^\s+$/.test(part)) {
                  return <span key={`a-s-${index}`}>{part}</span>;
                }
                const delay = wordIndex++ * 70;
                return (
                  <span
                    key={`a-${part}-${index}`}
                    className="mask-word text-saffron"
                    style={{ transitionDelay: `${delay}ms` }}
                  >
                    {part}
                  </span>
                );
              })
            : null}
          {line.dot ? (
            <span
              className="mask-word blink ml-[0.04em] inline-block h-[0.2em] w-[0.2em] rounded-full bg-saffron align-baseline"
              style={{ transitionDelay: `${wordIndex++ * 70}ms` }}
            />
          ) : null}
          {line.scribble ? (
            <svg
              className="scribble"
              viewBox="0 0 400 40"
              preserveAspectRatio="none"
              style={{ transitionDelay: `${wordIndex * 70 + 380}ms` }}
            >
              <path
                d="M6 28 C 70 10, 150 8, 230 16 S 360 30, 394 12"
                pathLength={1}
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
          ) : null}
          </span>
        </span>
      ))}
    </Tag>
  );
}
