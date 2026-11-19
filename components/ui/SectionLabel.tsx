import { cn } from '@/lib/cn';

type SectionLabelProps = {
  children: React.ReactNode;
  blink?: boolean;
  className?: string;
};

export function SectionLabel({ children, blink = false, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'm-0 flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted',
        className,
      )}
    >
      {blink ? <span className="blink inline-block h-2.5 w-2.5 rounded-full bg-saffron" aria-hidden="true" /> : null}
      {children}
    </p>
  );
}
