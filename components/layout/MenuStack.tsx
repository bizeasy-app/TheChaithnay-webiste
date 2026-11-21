'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { openAsk } from '@/components/askme/open-ask';
import { externalUrl } from '@/lib/links';
import { sections } from '@/lib/brand';
import { site } from '@/lib/site';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const ROLES: [string, string][] = [
  ['Tries', 'new.'],
  ['Learns', 'fast.'],
  ['Builds', 'big.'],
];

const LINKS = sections;

function isActive(href: string, pathname: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Contents of the full-screen menu: identity on one side, section links as a
 * stack of big type on the other. Lines rise in on open; the role line rolls.
 */
export function MenuStack({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const [role, setRole] = useState(0);
  const video = externalUrl(site.latestVideo.url);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setRole((value) => (value + 1) % ROLES.length), 2600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="rail-type mx-auto flex h-full w-full max-w-page flex-col justify-end gap-10 pb-10 min-[1180px]:grid min-[1180px]:grid-cols-[1fr_auto] min-[1180px]:items-end min-[1180px]:gap-x-16">
      <p
        className="m-0 flex flex-col max-[1179px]:hidden"
        aria-label={`I'm Chaithanya. ${ROLES.map((r) => r.join(' ')).join(' ')}`}
      >
        <span aria-hidden="true" className="rail-line text-ink" style={{ ['--i' as string]: 0 }}>
          I&apos;m
        </span>
        <span aria-hidden="true" className="rail-line text-ink" style={{ ['--i' as string]: 1 }}>
          Chaithanya<span className="text-saffron">.</span>
        </span>
        {[0, 1].map((line) => (
          <span key={line} aria-hidden="true" className="rail-line" style={{ ['--i' as string]: 2 + line }}>
            <span className="rail-roll block text-placeholder">
              <span className="rail-roll-track" style={{ translate: `0 ${-role * 1.32}em`, transitionDelay: `${line * 90}ms` }}>
                {ROLES.map((r) => (
                  <span key={r[line]} className="rail-roll-item">
                    {r[line]}
                  </span>
                ))}
              </span>
            </span>
          </span>
        ))}
      </p>

      <nav aria-label="Menu" className="flex flex-col min-[1180px]:items-end min-[1180px]:text-right">
        {LINKS.map((link, index) => {
          const active = isActive(link.href, pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`rail-line rail-link${active ? ' is-active' : ''}`}
              style={{ ['--i' as string]: 1 + index }}
            >
              <span className="rail-hash">#</span>
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          data-cursor="Ask"
          onClick={() => {
            onNavigate();
            openAsk();
          }}
          className="rail-line rail-link text-left min-[1180px]:text-right"
          style={{ ['--i' as string]: 1 + LINKS.length }}
        >
          <span className="rail-hash">#</span>Ask me
        </button>
      </nav>

      <div
        className="rail-in flex flex-wrap items-center justify-between gap-4 text-[14px] font-bold normal-case leading-normal tracking-normal min-[1180px]:col-span-2"
        style={{ ['--i' as string]: LINKS.length + 2 }}
      >
        <span className="font-semibold text-muted">Technology. AI. Entrepreneurship. Productivity. In Telugu &amp; English.</span>
        <span className="flex items-center gap-4">
          {video ? (
            <a href={video} target="_blank" rel="noopener noreferrer" data-cursor="Watch" className="draw text-ink">
              Latest video →
            </a>
          ) : null}
          <ThemeToggle className="border border-line" />
        </span>
      </div>
    </div>
  );
}
