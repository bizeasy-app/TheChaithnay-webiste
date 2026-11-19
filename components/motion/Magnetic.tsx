'use client';

import { useRef } from 'react';
import { cn } from '@/lib/cn';

export function Magnetic({
  children,
  className,
  strength = 0.32,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  function reset() {
    const node = ref.current;
    if (!node) return;
    node.style.translate = '0px 0px';
  }

  return (
    <span
      ref={ref}
      className={cn('magnetic inline-flex will-change-transform', className)}
      onPointerMove={(event) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (event.pointerType !== 'mouse') return;
        const node = ref.current;
        if (!node) return;
        const box = node.getBoundingClientRect();
        const x = event.clientX - (box.left + box.width / 2);
        const y = event.clientY - (box.top + box.height / 2);
        node.style.translate = `${x * strength}px ${y * strength}px`;
      }}
      onPointerLeave={reset}
      onPointerUp={reset}
    >
      {children}
    </span>
  );
}
