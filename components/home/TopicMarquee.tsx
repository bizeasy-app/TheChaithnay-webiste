'use client';

import { useState } from 'react';
import { Marquee } from '@/components/ui/Marquee';
import { series } from '@/lib/brand';

const topics = series.map((item) => item.name);

export function TopicMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="mt-16 min-[861px]:mt-[88px]">
      <Marquee items={topics} paused={paused} />
      <div className="mx-auto flex w-full max-w-page justify-end px-5 pt-3 max-[480px]:px-4">
        <button
          type="button"
          className="focus-on-ink inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-[13px] font-extrabold tracking-[0.06em] text-cloud"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
        >
          {paused ? 'Play series' : 'Pause series'}
        </button>
      </div>
    </div>
  );
}
