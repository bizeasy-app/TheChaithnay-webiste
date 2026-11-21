'use client';

import { useState } from 'react';
import { BinduMark } from '@/components/brand/BinduMark';
import { PlayIcon } from '@/components/home/icons';

export function LiteYouTube({ videoId, label = 'Watch the video version' }: { videoId: string; label?: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={label}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="relative flex h-full w-full items-center justify-center bg-transparent text-ink"
      aria-label={label}
    >
      <BinduMark
        size={480}
        tone="paper"
        className="pointer-events-none absolute -bottom-[140px] -right-[100px] opacity-[0.22]"
      />
      <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-cloud text-ink">
        <PlayIcon />
      </span>
      <span className="absolute bottom-6 left-6 rounded-full bg-ink px-3.5 py-2 text-sm font-extrabold text-cloud">{label}</span>
    </button>
  );
}
