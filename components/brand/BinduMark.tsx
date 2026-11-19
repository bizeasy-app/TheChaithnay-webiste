type BinduMarkProps = {
  size?: number;
  tone?: 'ink' | 'cloud';
  blink?: boolean;
  className?: string;
};

export function BinduMark({ size = 32, tone = 'ink', blink = false, className }: BinduMarkProps) {
  const stroke = tone === 'ink' ? '#1A1714' : '#F0EEE9';

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
