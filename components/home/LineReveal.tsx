'use client';

import { useEffect, useRef, useState } from 'react';

type Line = {
  text: string;
  accent?: string;
  dot?: boolean;
};

function words(value: string) {
  return value.split(/(\s+)/).filter(Boolean);
}

export function LineReveal({
  id,
  as: Tag = 'h2',
  className,
  lines,
}: {
  id?: string;
  as?: 'h1' | 'h2';
  className?: string;
  lines: Line[];
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

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
      className={`mask-reveal${armed ? ' is-armed' : ''}${shown ? ' is-in' : ''} ${className ?? ''}`}
    >
      {lines.map((line) => (
        <span key={`${line.text}-${line.accent ?? ''}`} className="mask-line" aria-hidden="true">
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
        </span>
      ))}
    </Tag>
  );
}
