'use client';

import { openAsk } from '@/components/askme/open-ask';
import { cn } from '@/lib/cn';

export function AskChat({
  question,
  slug,
  className,
  children,
}: {
  question?: string;
  slug?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={() => openAsk({ question, slug })} className={cn('text-left', className)}>
      {children}
    </button>
  );
}
