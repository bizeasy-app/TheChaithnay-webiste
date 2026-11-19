'use client';

import { useEffect, useState } from 'react';

type TocItem = { id: string; text: string; depth: number };

export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-112px 0px -55% 0px', threshold: [0, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  function links() {
    return items.map((item) => {
      const current = item.id === active;
      return (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={current ? 'true' : undefined}
          className={`inline-flex min-h-11 items-center rounded-xl px-3.5 no-underline ${item.depth > 1 ? 'ml-3' : ''} ${
            current ? 'bg-ink text-cloud' : 'text-body'
          }`}
        >
          {item.text}
        </a>
      );
    });
  }

  return (
    <>
      <details className="rounded-2xl border border-line bg-white min-[861px]:hidden">
        <summary className="min-h-11 cursor-pointer px-4 py-3 text-[15px] font-extrabold">On this page</summary>
        <nav aria-label="Table of contents" className="flex flex-col gap-1 px-2 pb-3 text-[15px] font-bold">
          {links()}
        </nav>
      </details>
      <nav aria-label="Table of contents" className="hidden flex-col gap-1 text-[15px] font-bold min-[861px]:flex">
        <span className="pb-2 text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted">On this page</span>
        {links()}
      </nav>
    </>
  );
}
