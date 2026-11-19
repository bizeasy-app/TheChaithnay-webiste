'use client';

import { openAsk } from '@/components/askme/open-ask';

export function AskMeTextButton({
  className,
  children,
  onOpen,
}: {
  className?: string;
  children: React.ReactNode;
  onOpen?: () => void;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onOpen?.();
        openAsk();
      }}
    >
      {children}
    </button>
  );
}
