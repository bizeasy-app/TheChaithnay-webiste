/** Outline social glyphs, 24×24, drawn with currentColor at a thin stroke. */
const base = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function LinkedInGlyph() {
  return (
    <svg {...base}>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M8 10.5V17M12 17v-6.5M12 13.4c0-1.7 1.1-2.9 2.6-2.9 1.5 0 2.4 1 2.4 2.9V17" />
      <circle cx="8" cy="7.4" r="0.4" fill="currentColor" />
    </svg>
  );
}

export function XGlyph() {
  return (
    <svg {...base}>
      <path d="M4 3.5h4.6L20 20.5h-4.6Z" />
      <path d="M19.5 3.5 13.2 10.6M4.5 20.5l6.3-7.1" />
    </svg>
  );
}

export function InstagramGlyph() {
  return (
    <svg {...base}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function YouTubeGlyph() {
  return (
    <svg {...base}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.3 9.3v5.4l4.6-2.7Z" />
    </svg>
  );
}

export function LetterGlyph() {
  return (
    <svg {...base}>
      <path d="m7.6 2.8 9.9 1.6-2.7 16.8-9.9-1.6Z" />
      <path d="M9.4 7.6l5.4.9M9 10.4l5.4.9M8.5 13.2l3.6.6" />
    </svg>
  );
}

export function ArrowRight({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  );
}

const nav = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function HomeGlyph() {
  return (
    <svg {...nav}>
      <path d="M4 10.5 12 4l8 6.5V20H4Z" />
      <path d="M10 20v-5.5h4V20" />
    </svg>
  );
}

export function NotesGlyph() {
  return (
    <svg {...nav}>
      <path d="M6 3.5h9l3.5 3.5v13.5H6Z" />
      <path d="M14.5 3.5V7.5h4M9 11h6.5M9 14h6.5M9 17h4" />
    </svg>
  );
}

export function GridGlyph() {
  return (
    <svg {...nav}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </svg>
  );
}

export function PersonGlyph() {
  return (
    <svg {...nav}>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.8 20c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6" />
    </svg>
  );
}

export function MailGlyph() {
  return (
    <svg {...nav}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 6.5 8 6.5 8-6.5M4 18l6-5.5M20 18l-6-5.5" />
    </svg>
  );
}
