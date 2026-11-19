'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, '');
  if (!id) return;
  const node = document.getElementById(id);
  if (!node) return;

  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(node, { offset: -96, duration: 1.1 });
    return;
  }
  node.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const timer = window.setTimeout(() => scrollToHash(hash), 60);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = (event.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || !href.includes('#')) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname && url.pathname !== pathname) return;
      if (!url.hash) return;

      event.preventDefault();
      if (url.pathname !== window.location.pathname) {
        window.history.pushState({}, '', `${url.pathname}${url.hash}`);
      } else {
        window.history.replaceState({}, '', `${url.pathname}${url.hash}`);
      }
      scrollToHash(url.hash);
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

  return null;
}
