import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
};

export function Chip({ pressed = false, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        'inline-flex min-h-11 items-center rounded-full border-[1.5px] px-[18px] text-[14px] font-bold',
        pressed ? 'border-ink bg-ink text-cloud' : 'border-line-strong bg-transparent text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
