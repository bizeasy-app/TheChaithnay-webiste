import Link from 'next/link';
import { cn } from '@/lib/cn';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
};

export function Card({ children, className, href }: CardProps) {
  const classes = cn('lift block rounded-[28px] border border-line bg-white p-8 text-ink', className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
