'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { AskMeTextButton } from '@/components/askme/AskMeTextButton';
import { Logo } from '@/components/brand/Logo';

const links = [
  { href: '/blog', label: 'Blog' },
  { href: '/products', label: 'Products' },
];

function isActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function JoinLink() {
  return (
    <Link
      href="/newsletter"
      className="focus-on-ink press inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-ink px-3.5 text-[15px] font-bold text-cloud transition duration-300 hover:scale-[1.03] sm:px-5"
    >
      Join the log
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

    const sheet = sheetRef.current;
    const focusable = sheet?.querySelectorAll<HTMLElement>('a, button');
    focusable?.[0]?.focus();

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
    <header className="sticky top-4 z-30 mx-auto mt-4 w-full max-w-page px-5 max-[480px]:px-4">
      <div className="site-nav relative z-30 flex items-center justify-between gap-3 rounded-full border border-[rgba(26,23,20,0.08)] bg-[rgba(240,238,233,0.82)] py-2.5 pl-5 pr-2.5 backdrop-blur-[14px]">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 min-[861px]:flex">
          {links.map((link) => {
            const active = isActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-3.5 text-[15px] no-underline ${
                  active ? 'bg-white font-extrabold text-ink' : 'font-semibold text-body hover:text-muted'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <AskMeTextButton className="inline-flex min-h-11 items-center rounded-full px-3.5 text-[15px] font-semibold text-body hover:text-muted">
            Ask me
          </AskMeTextButton>
          <JoinLink />
        </nav>
        <div className="flex items-center gap-1 min-[861px]:hidden">
          <JoinLink />
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {open ? (
        <div
          ref={sheetRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-x-0 bottom-0 top-0 z-20 bg-cloud px-4 pt-28 min-[861px]:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {links.map((link) => {
              const active = isActive(link.href, pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center text-[17px] font-bold ${
                    active ? 'text-ink' : 'text-body'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <AskMeTextButton
              onOpen={() => setOpen(false)}
              className="inline-flex min-h-11 items-center text-left text-[17px] font-bold text-body"
            >
              Ask me
            </AskMeTextButton>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
