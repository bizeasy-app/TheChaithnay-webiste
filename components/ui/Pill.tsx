import { cn } from '@/lib/cn';

type PillProps = {
  children: React.ReactNode;
  tone?: 'ink' | 'saffron' | 'white';
  className?: string;
};

const tones = {
  ink: 'bg-ink text-cloud',
  saffron: 'bg-saffron text-coal',
  white: 'border border-line bg-white text-ink',
};

export function Pill({ children, tone = 'ink', className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
