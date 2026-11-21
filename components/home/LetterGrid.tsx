'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const COLS = 12;
const ROWS = 13;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Hidden words, each tied to a headline line (spotlight index) or always-on (-1).
const WORDS: { word: string; row: number; col: number; group: number }[] = [
  { word: 'TRYNEW', row: 2, col: 3, group: 0 },
  { word: 'LEARNFAST', row: 5, col: 1, group: 1 },
  { word: 'BUILDBIG', row: 8, col: 4, group: 2 },
  { word: 'CHAITHANYA', row: 11, col: 1, group: -1 },
];

/** Deterministic PRNG so server and client render the same letters. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Cell = { letter: string; group: number | null };

function buildGrid(): Cell[] {
  const rand = mulberry32(1729);
  const cells: Cell[] = Array.from({ length: COLS * ROWS }, () => ({
    letter: ALPHABET[Math.floor(rand() * ALPHABET.length)],
    group: null,
  }));
  for (const { word, row, col, group } of WORDS) {
    [...word].forEach((letter, index) => {
      cells[row * COLS + col + index] = { letter, group };
    });
  }
  return cells;
}

/**
 * Word-search panel beside the hero. Filler letters quietly re-shuffle; the
 * hidden word matching the headline's spotlit line lights up in saffron.
 */
export function LetterGrid({ className }: { className?: string }) {
  const base = useMemo(buildGrid, []);
  const [active, setActive] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onSpot = (event: Event) => setActive((event as CustomEvent<number>).detail);
    window.addEventListener('tc:spotlight', onSpot);
    return () => window.removeEventListener('tc:spotlight', onSpot);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const filler = Array.from(node.querySelectorAll<HTMLSpanElement>('[data-filler]'));
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(node);

    const timer = window.setInterval(() => {
      if (!visible || document.hidden) return;
      for (let i = 0; i < 3; i++) {
        const cell = filler[Math.floor(Math.random() * filler.length)];
        if (!cell) continue;
        cell.classList.add('is-flip');
        window.setTimeout(() => {
          cell.textContent = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
          cell.classList.remove('is-flip');
        }, 160);
      }
    }, 220);

    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`letter-grid grid select-none font-mono text-[13px] font-medium ${className ?? ''}`}
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
    >
      {base.map((cell, index) => {
        const lit = cell.group !== null && (cell.group === -1 || cell.group === active);
        const tone = cell.group === -1 ? ' is-name' : lit ? ' is-lit' : '';
        return (
          <span
            key={index}
            data-filler={cell.group === null ? '' : undefined}
            className={`letter-cell${tone}`}
            style={lit && cell.group !== -1 ? { transitionDelay: `${(index % COLS) * 45}ms` } : undefined}
          >
            {cell.letter}
          </span>
        );
      })}
    </div>
  );
}
