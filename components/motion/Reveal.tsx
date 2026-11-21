'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

export function Reveal({
  as: Tag = 'div',
  className,
  delay = 0,
  speed,
  children,
}: {
  as?: 'div' | 'section' | 'article' | 'span' | 'li';
  className?: string;
  delay?: number;
  /** Desktop scroll parallax; see ScrollFX. */
  speed?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-in');
      return;
    }

    node.style.setProperty('--reveal-delay', `${delay}ms`);
    const show = () => {
      node.classList.add('is-in');
      node.querySelectorAll('.fx-wipe').forEach((child) => child.classList.add('is-in'));
    };
    if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        show();
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref as never} className={cn('fx-reveal', className)} data-speed={speed || undefined}>
      {children}
    </Tag>
  );
}
