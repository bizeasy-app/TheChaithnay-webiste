import Link from 'next/link';
import { GridGlyph, NotesGlyph } from '@/components/social/icons';

type Key = 'about' | 'insights' | 'projects' | 'newsletter';

const LINKS: { key: Key; href: string; label: string }[] = [
  { key: 'about', href: '/about', label: 'About' },
  { key: 'insights', href: '/insights', label: 'Insights' },
  { key: 'projects', href: '/projects', label: 'Projects' },
  { key: 'newsletter', href: '/newsletter', label: 'Newsletter' },
];

const BADGE: Partial<Record<Key, () => React.JSX.Element>> = {
  insights: NotesGlyph,
  projects: GridGlyph,
};

/**
 * Left column of the split pages: identity lines, then the sections as a
 * stack of big type. The current section is lit, the rest are dimmed; the
 * lines rise in one after another.
 */
export function StackNav({ current, children }: { current: Key; children?: React.ReactNode }) {
  return (
    <aside className="stack-nav min-[1024px]:sticky min-[1024px]:top-28 min-[1024px]:flex min-[1024px]:h-[calc(100vh-9rem)] min-[1024px]:flex-col min-[1024px]:justify-center min-[1024px]:border-r min-[1024px]:border-line min-[1024px]:pr-10">
      <div className="stack-type flex flex-col min-[1024px]:items-end min-[1024px]:text-right">
        <span className="stack-line stack-dim max-[1023px]:hidden" style={{ ['--i' as string]: 0 }}>
          I&apos;m
        </span>
        <span className="stack-line stack-name max-[1023px]:hidden" style={{ ['--i' as string]: 1 }}>
          Chaithanya
        </span>
        <span className="stack-line stack-dim max-[1023px]:hidden" style={{ ['--i' as string]: 2 }}>
          Try new.
        </span>
        <span className="stack-line stack-dim max-[1023px]:hidden" style={{ ['--i' as string]: 3 }}>
          Build big.
        </span>
        <nav aria-label="Sections" className="flex flex-wrap gap-x-5 min-[1024px]:flex-col min-[1024px]:items-end">
          {LINKS.map((link, index) => {
            const active = link.key === current;
            const Badge = BADGE[link.key];
            return (
              <Link
                key={link.key}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`stack-line stack-link${active ? ' is-active' : ''}`}
                style={{ ['--i' as string]: 4 + index }}
              >
                {Badge ? (
                  <span className="stack-badge max-[1023px]:hidden" aria-hidden="true">
                    <Badge />
                  </span>
                ) : null}
                <span className="stack-hash">#</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children ? (
        <div className="stack-in mt-8 max-w-[420px] text-[17px] font-medium leading-[1.55] text-body min-[1024px]:ml-auto min-[1024px]:text-right" style={{ ['--i' as string]: 9 }}>
          {children}
        </div>
      ) : null}
    </aside>
  );
}

/** Split page shell: StackNav on the left (sticky on desktop), feed on the right. */
export function SplitPage({ nav, children }: { nav: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-page gap-10 px-5 pt-10 max-[480px]:px-4 min-[1024px]:grid-cols-[minmax(0,1fr)_minmax(0,560px)] min-[1024px]:gap-14 min-[1024px]:pt-6 min-[1180px]:grid-cols-[minmax(0,1fr)_minmax(0,600px)]">
      {nav}
      <div className="min-w-0 pb-8 min-[1024px]:pt-[18vh]">{children}</div>
    </div>
  );
}
