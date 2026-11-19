'use client';

import { openAsk } from '@/components/askme/open-ask';

export function AskTile() {
  return (
    <button
      type="button"
      onClick={() => openAsk({ question: 'What should I learn first?' })}
      className="lift ink-wash flex h-full flex-col justify-between gap-3 rounded-[28px] bg-ink p-7 text-left text-cloud"
    >
      <span className="text-[13px] font-extrabold tracking-[0.08em] text-muted-dark">ASK ME</span>
      <span className="flex flex-col gap-2">
        <span className="self-end rounded-[14px_14px_4px_14px] bg-[#3A342E] px-3 py-2 text-sm font-semibold">
          What should I learn first?
        </span>
        <span className="self-start rounded-[14px_14px_14px_4px] bg-cloud px-3 py-2 text-sm font-semibold text-ink">
          Start with week 1
          <span className="blink ml-1 inline-block h-[7px] w-[7px] rounded-full bg-saffron" aria-hidden="true" />
        </span>
      </span>
      <span className="text-[16px] font-extrabold">Start a chat →</span>
    </button>
  );
}
