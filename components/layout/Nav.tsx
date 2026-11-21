'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { BinduMark } from '@/components/brand/BinduMark';
import { MenuStack } from '@/components/layout/MenuStack';
import { socials } from '@/components/social/socials';

function JoinLink() {
  return (
    <Link
      href="/newsletter"
      data-magnetic="0.25"
      className="focus-on-ink press inline-flex h-11 items-center whitespace-nowrap rounded-full bg-ink px-4 min-[861px]:h-12 text-[15px] font-bold text-cloud transition duration-300 hover:scale-[1.03] sm:px-5"
    >
      Subscribe
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    // Not lenis.stop(): it clips <html>, which breaks the sticky header.
    // The sheet is data-lenis-prevent with overscroll containment instead.
    document.documentElement.classList.add('menu-open');
    return () => document.documentElement.classList.remove('menu-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const sheet = sheetRef.current;
    // Focus the sheet itself: screen readers land in the dialog, and no focus
    // ring is painted on the first link after a mouse click.
    sheet?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !sheet) return;
      const nodes = [
        buttonRef.current,
        ...Array.from(sheet.querySelectorAll<HTMLElement>('a, button')),
      ].filter((node): node is HTMLElement => node !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className="site-header sticky top-[var(--bar-y)] z-30 mx-auto mt-[var(--bar-y)] w-full max-w-page px-5 max-[480px]:px-4">
      <div className="site-nav relative z-30 flex items-center justify-between gap-3">
        <Link
          href="/"
          aria-label="The Chaithanya, home"
          className="bar-brand bar-in group inline-flex min-h-11 items-center gap-3 rounded-full pr-3 text-ink no-underline"
        >
          <span className="bar-mark inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full min-[861px]:h-12 min-[861px]:w-12">
            <BinduMark size={26} />
          </span>
          <span className="bar-word text-[17px] font-extrabold tracking-[-0.03em] max-[599px]:hidden" aria-hidden="true">
            The Chaithanya
          </span>
        </Link>
        <div className="flex items-center gap-2">
        {socials.length > 0 ? (
          <nav aria-label="Social media" className="bar-pill bar-in flex items-center p-1.5" style={{ animationDelay: '60ms' }}>
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="bar-social relative inline-flex h-11 w-11 items-center justify-center rounded-full text-body min-[861px]:h-12 min-[861px]:w-12"
              >
                <item.Icon />
                <span className="bar-tip" aria-hidden="true">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>
        ) : null}
        <div className="bar-pill bar-in flex items-center gap-1.5 p-1.5" style={{ animationDelay: '120ms' }}>
          <span className="max-[479px]:hidden">
            <JoinLink />
          </span>
          <button
            ref={buttonRef}
            type="button"
            data-magnetic="0.3"
            className="menu-toggle inline-flex h-11 min-w-11 min-[861px]:h-12 items-center justify-center gap-2 rounded-full px-2 text-[15px] font-bold min-[861px]:px-3.5"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="hidden min-[861px]:inline" aria-hidden="true">
              {open ? 'Close' : 'Menu'}
            </span>
            <span className={`menu-icon${open ? ' is-open' : ''}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
        </div>
      </div>
      {open ? (
        <div
          ref={sheetRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-lenis-prevent
          tabIndex={-1}
          className="menu-sheet outline-none fixed inset-0 z-20 overflow-y-auto bg-cloud px-5 pt-28 max-[480px]:px-4"
        >
          <MenuStack pathname={pathname} onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </header>
  );
}
