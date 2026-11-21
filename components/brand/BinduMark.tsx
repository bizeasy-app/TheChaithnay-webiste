type BinduMarkProps = {
  size?: number;
  /** ink/cloud follow the theme; paper is fixed light (for indigo/photo backgrounds). */
  tone?: 'ink' | 'cloud' | 'paper';
  blink?: boolean;
  className?: string;
};

export function BinduMark({ size = 32, tone = 'ink', blink = false, className }: BinduMarkProps) {
  const stroke = tone === 'paper' ? 'var(--paper)' : tone === 'ink' ? 'var(--ink)' : 'var(--cloud)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M29.37 9.6 A14 14 0 1 0 29.37 30.4"
        fill="none"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="34" cy="20" r="4" fill="#E8792B" className={blink ? 'blink' : undefined} />
    </svg>
  );
}
