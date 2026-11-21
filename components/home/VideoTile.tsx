'use client';

import { useState } from 'react';
import { PlayIcon } from '@/components/home/icons';

type Props = {
  id: string;
  week: string;
  headline: string;
  detail?: string;
  /** Extra classes from the parent, such as the scroll-in reveal. */
  className?: string;
};

const frame =
  'group relative block aspect-video w-full overflow-hidden rounded-[28px] bg-coal text-paper shadow-[0_24px_60px_-28px_rgba(26,23,20,0.55)]';

/**
 * The latest video at its true 16:9 shape, so the thumbnail and the player
 * both fill it edge to edge with no black bars. Pressing play swaps the
 * thumbnail for the player in place (privacy-enhanced embed); nothing from
 * YouTube loads before that except the thumbnail image.
 */
export function VideoTile({ id, week, headline, detail, className = '' }: Props) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

  if (playing) {
    return (
      // The reveal animation already ran on the thumbnail, so the player skips it.
      <div className={`${frame} ${className.replace('fx-wipe', '')}`}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={headline}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${headline}`}
      data-cursor="Play"
      className={`${frame} lift text-left ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumb}
        alt=""
        loading="lazy"
        decoding="async"
        // Some videos have no full-size thumbnail; fall back to the one YouTube always makes.
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth <= 120) setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        }}
        onError={() => setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
      />
      {/* Just enough shade at the bottom for the caption; the thumbnail speaks for itself. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(20,18,16,0.88),rgba(20,18,16,0))]"
      />

      <span className="absolute left-4 top-4 rounded-full bg-[rgba(20,18,16,0.6)] px-3 py-1.5 text-[13px] font-bold backdrop-blur-md min-[861px]:left-5 min-[861px]:top-5">
        Latest video, week {week}
      </span>

      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-saffron text-coal shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition duration-500 group-hover:scale-110 min-[861px]:h-20 min-[861px]:w-20"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-saffron opacity-25 motion-reduce:hidden" />
        <span className="relative">
          <PlayIcon />
        </span>
      </span>

      <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 min-[861px]:inset-x-5 min-[861px]:bottom-5">
        <span className="max-w-[30ch] text-[15px] font-extrabold leading-tight tracking-[-0.01em] min-[861px]:text-[17px]">
          {headline}
        </span>
        {detail ? (
          <span className="shrink-0 rounded-md bg-[rgba(20,18,16,0.75)] px-2 py-0.5 font-mono text-[13px] font-semibold tabular-nums">
            {detail}
          </span>
        ) : null}
      </span>
    </button>
  );
}
