'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
export const THEME_KEY = 'tc-theme';
const COLORS: Record<Theme, string> = { dark: '#141210', light: '#F0EEE9' };

/** Inline in <head>: applies the saved theme before first paint. Dark is the default. */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');}catch(e){}var d=document.documentElement;d.dataset.theme=t==='light'?'light':'dark';var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',d.dataset.theme==='light'?'${COLORS.light}':'${COLORS.dark}');})();`;

function apply(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLORS[theme]);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode: theme still applies for this visit */
  }
}

/**
 * Light/dark switch. Where supported, the new theme wipes in as a circle
 * growing from the button (View Transitions); otherwise it swaps instantly.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      data-magnetic="0.35"
      onClick={(event) => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
        if (reduce || !doc.startViewTransition) {
          apply(next);
          setTheme(next);
          return;
        }
        const box = event.currentTarget.getBoundingClientRect();
        const x = box.left + box.width / 2;
        const y = box.top + box.height / 2;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        const transition = doc.startViewTransition(() => {
          apply(next);
          setTheme(next);
        });
        transition.ready
          .then(() => {
            document.documentElement.animate(
              { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
              { duration: 620, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
            );
          })
          .catch(() => undefined);
      }}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`theme-toggle inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${className ?? ''}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <g className="theme-sun">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
        </g>
        <path className="theme-moon" d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
