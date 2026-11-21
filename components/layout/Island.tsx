'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BinduMark } from '@/components/brand/BinduMark';
import { openAsk } from '@/components/askme/open-ask';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { ArrowUpRight, GridGlyph, HomeGlyph, MailGlyph, NotesGlyph, PersonGlyph } from '@/components/social/icons';

const links = [
  { href: '/', label: 'Home', Icon: HomeGlyph, exact: true, phone: true },
  { href: '/insights', label: 'Insights', Icon: NotesGlyph, exact: false, phone: true },
  { href: '/projects', label: 'Projects', Icon: GridGlyph, exact: false, phone: true },
  { href: '/about', label: 'About', Icon: PersonGlyph, exact: false, phone: false },
  { href: '/contact', label: 'Contact', Icon: MailGlyph, exact: false, phone: false },
];

type Mode = 'full' | 'compact' | 'ask';

function isActive(href: string, pathname: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function toTop() {
  const lenis = (window as Window & { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('content')?.focus({ preventScroll: true });
}

/**
 * The one floating control, bottom centre: pages, theme, Ask me and a
 * reading-progress ring. It tucks into a small pill while you read down
 * the page and opens again when you scroll up, hover or focus it. Ask me
 * (or ⌘K) turns the island into a question box.
 */
export function Island() {
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode>('full');
  const [question, setQuestion] = useState('');
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const [shortcut, setShortcut] = useState('⌘K');
  const inputRef = useRef<HTMLInputElement>(null);
  const askButtonRef = useRef<HTMLButtonElement>(null);
  const modeRef = useRef<Mode>('full');
  modeRef.current = mode;

  // Scroll direction drives compact/full; it also hides the top bar.
  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;
    let frame = 0;
    const minutes = Number(document.querySelector<HTMLElement>('[data-read-minutes]')?.dataset.readMinutes ?? 0);

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        const down = delta > 0 && y > 320;
        root.classList.toggle('scroll-down', down);
        if (modeRef.current !== 'ask') setMode(down ? 'compact' : 'full');
        lastY = y;
      }
      if (y < 40) {
        root.classList.remove('scroll-down');
        if (modeRef.current !== 'ask') setMode('full');
      }
      setMinutesLeft(minutes > 0 ? Math.max(0, Math.ceil(minutes * (1 - Math.min(1, y / max)))) : null);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      root.classList.remove('scroll-down');
    };
  }, [pathname]);

  // ⌘K / Ctrl+K opens the question box from anywhere.
  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setShortcut('Ctrl K');
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setMode('ask');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (mode === 'ask') window.setTimeout(() => inputRef.current?.focus(), 60);
  }, [mode]);

  const closeAsk = (refocus = true) => {
    setMode('full');
    setQuestion('');
    if (refocus) window.setTimeout(() => askButtonRef.current?.focus(), 0);
  };

  const expand = () => {
    if (modeRef.current === 'compact') setMode('full');
  };

  return (
    <div className="island-wrap" data-mode={mode}>
      <nav aria-label="Main" className="island" onPointerEnter={expand} onFocus={expand}>
        <div className="island-slot island-links">
          <div className="flex items-center gap-0.5">
            {links.map(({ href, label, Icon, exact, phone }) => {
              const active = isActive(href, pathname, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  aria-current={active ? 'page' : undefined}
                  tabIndex={mode === 'ask' ? -1 : undefined}
                  className={`island-link${active ? ' is-active' : ''}${phone ? '' : ' max-[600px]:hidden'}`}
                >
                  <Icon />
                  <span className="island-tip" aria-hidden="true">
                    {label}
                  </span>
                </Link>
              );
            })}
            <ThemeToggle className="island-link max-[600px]:hidden" />
            <span className="island-divider" aria-hidden="true" />
          </div>
        </div>

        {mode === 'ask' ? (
          <form
            role="search"
            className="island-form"
            onSubmit={(event) => {
              event.preventDefault();
              const value = question.trim();
              closeAsk(false);
              openAsk(value ? { question: value } : {});
            }}
          >
            <label htmlFor="island-q" className="sr-only">
              Ask me anything
            </label>
            <span className="inline-flex shrink-0 pl-2" aria-hidden="true">
              <BinduMark size={20} tone="paper" />
            </span>
            <input
              ref={inputRef}
              id="island-q"
              type="text"
              autoComplete="off"
              enterKeyHint="send"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') closeAsk();
              }}
              onBlur={(event) => {
                if (!question && !event.currentTarget.form?.contains(event.relatedTarget as Node)) closeAsk(false);
              }}
              placeholder="How do you build apps with AI?"
              className="island-input"
            />
            <button type="submit" className="island-send" aria-label="Ask">
              <ArrowUpRight size={18} />
            </button>
          </form>
        ) : (
          <button
            ref={askButtonRef}
            type="button"
            onClick={() => setMode('ask')}
            aria-keyshortcuts="Meta+K Control+K"
            className="island-ask focus-on-ink"
          >
            <span className="island-bindu inline-flex">
              <BinduMark size={20} tone="cloud" />
            </span>
            <span>
              Ask me<span className="island-ask-more"> anything</span>
            </span>
            <kbd className="island-kbd" aria-hidden="true">
              {shortcut}
            </kbd>
          </button>
        )}

        <button type="button" onClick={toTop} aria-label="Back to top" data-cursor="Top" className="island-ring">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="29" fill="none" className="island-ring-track" strokeWidth="3" />
            <circle cx="32" cy="32" r="29" fill="none" className="island-ring-fill" strokeWidth="3" pathLength={1} />
          </svg>
          <span className="island-ring-arrow inline-flex">
            <ArrowUpRight size={16} />
          </span>
        </button>
        {minutesLeft !== null && mode === 'compact' ? (
          <span className="island-left" aria-hidden="true">
            {minutesLeft === 0 ? 'Done' : `${minutesLeft} min left`}
          </span>
        ) : null}
      </nav>
    </div>
  );
}
