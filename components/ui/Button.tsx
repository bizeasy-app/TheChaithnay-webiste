import Link from 'next/link';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'ink' | 'saffron' | 'outline' | 'cloud';
type ButtonSize = 'md' | 'lg';

const variants: Record<ButtonVariant, string> = {
  ink: 'focus-on-ink border-transparent bg-ink text-cloud',
  saffron: 'border-transparent bg-saffron text-coal',
  outline: 'border-ink bg-transparent text-ink',
  cloud: 'border-transparent bg-cloud text-ink',
};

const sizes: Record<ButtonSize, string> = {
  md: 'px-5 text-[15px] font-bold',
  lg: 'px-6 text-[16px] font-extrabold',
};

type Shared = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = Shared &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonLinkProps = Shared & {
  href: string;
};

export function Button(props: ButtonProps | ButtonLinkProps) {
  const variant = props.variant ?? 'ink';
  const size = props.size ?? 'md';
  const className = cn(
    'press inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border-[1.5px] text-center no-underline transition duration-300 hover:-translate-y-0.5',
    'disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    props.className,
  );

  if (props.href) {
    return (
      <Link href={props.href} className={className} data-magnetic="0.22">
        {props.children}
      </Link>
    );
  }

  const { variant: _variant, size: _size, className: _className, ...buttonProps } = props;
  return (
    <button type="button" data-magnetic="0.22" {...buttonProps} className={className}>
      {props.children}
    </button>
  );
}
