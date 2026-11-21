'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from '@/components/social/icons';
import { socials } from '@/components/social/socials';

/**
 * Social dock fixed to the bottom-left, always in view like the navbar.
 * The round arrow opens/closes the icon tray (open on tablet and desktop, closed on * phones so it never covers content). Icons slide in one after another; the
 * rule under the pill fills with page scroll.
 */
export function FloatingDock() {
  const [open, setOpen] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOpen(window.matchMedia('(min-width: 600px)').matches);
    const timer = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  // On phones the open tray and the Ask me button share the bottom edge.
  useEffect(() => {
    document.documentElement.classList.toggle('dock-open', open);
    return () => document.documentElement.classList.remove('dock-open');
  }, [open]);

  return (
    <nav
      aria-label="Social media"
      data-open={open}
      data-ready={ready}
      className="float-dock social-dock corner corner-bl inline-flex"
      style={{ ['--corner-i' as string]: 2 }}
    >
      <div className="float-dock-pill corner-pill flex items-center p-1.5">
        <button
          type="button"
          data-magnetic="0.35"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Hide social links' : 'Show social links'}
          className="press inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-cloud transition duration-500 hover:scale-[1.06] min-[861px]:h-12 min-[861px]:w-12"
        >
          <span className="float-dock-arrow inline-flex">
            <ArrowRight size={20} />
          </span>
        </button>
        <div className="float-dock-tray" aria-hidden={!open}>
          <div className="flex items-center gap-0.5 pl-1 min-[861px]:gap-1 min-[861px]:pl-1.5">
            {socials.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                tabIndex={open ? undefined : -1}
                className="dock-icon relative inline-flex h-11 w-11 items-center justify-center rounded-full text-body min-[861px]:h-12 min-[861px]:w-12"
                style={{ ['--i' as string]: index }}
              >
                <item.Icon />
                <span className="dock-tip" aria-hidden="true">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <span className="dock-rule" aria-hidden="true" />
    </nav>
  );
}
