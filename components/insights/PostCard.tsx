'use client';

import Link from 'next/link';
import { BinduMark } from '@/components/brand/BinduMark';
import { formatPostDate } from '@/lib/format';
import { youtubeId } from '@/lib/youtube';

export type PostCardData = {
  slug: string;
  title: string;
  topic: string;
  summary: string;
  date: string;
  cover: string;
  videoUrl: string;
  readingMinutes: number;
};

/** Same pairing as lib/images (kept local: that module imports sharp/fs). */
function webpSources(url: string) {
  if (!url.endsWith('-1200.webp')) return undefined;
  return `${url.replace(/-1200\.webp$/, '-600.webp')} 600w, ${url} 1200w`;
}

function coverFor(post: PostCardData) {
  if (post.cover) return { src: post.cover, srcSet: webpSources(post.cover), fallback: '' };
  const id = post.videoUrl ? youtubeId(post.videoUrl) : '';
  // hq720 is 16:9 without baked-in letterbox bars; mqdefault always exists.
  if (id) return { src: `https://i.ytimg.com/vi/${id}/hq720.jpg`, srcSet: undefined, fallback: `https://i.ytimg.com/vi/${id}/mqdefault.jpg` };
  return null;
}

/**
 * Blog card: cover on top, meta + title below. On hover/focus the title rolls
 * up and the summary rolls in (same box), and the cover eases in closer.
 */
export function PostCard({ post, index = 0 }: { post: PostCardData; index?: number }) {
  const cover = coverFor(post);
  const meta = [formatPostDate(post.date), post.readingMinutes ? `${post.readingMinutes} min` : '']
    .filter(Boolean)
    .join(' · ');

  return (
    <Link
      href={`/insights/${post.slug}`}
      data-cursor="Read"
      className="post-card card-in group flex flex-col overflow-hidden rounded-[24px] border border-line bg-white text-ink no-underline"
      style={{ ['--i' as string]: index }}
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-indigo">
        {cover ? (
          <img
            src={cover.src}
            srcSet={cover.srcSet}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            alt=""
            loading="lazy"
            decoding="async"
            onError={(event) => {
              const img = event.currentTarget;
              if (cover.fallback && img.src !== cover.fallback) img.src = cover.fallback;
            }}
            className="post-card-img h-full w-full object-cover"
          />
        ) : (
          <span className="post-card-img flex h-full w-full items-center justify-center [background-image:radial-gradient(rgba(240,238,233,0.14)_1.5px,transparent_1.5px)] [background-size:20px_20px]">
            <BinduMark size={88} tone="paper" />
          </span>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-cloud px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.06em] text-ink">
          {post.topic}
        </span>
        {post.videoUrl ? (
          <span className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cloud">
            <span className="sr-only">Has video</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        ) : null}
      </span>
      <span className="flex flex-1 flex-col gap-3 p-6">
        <span className="text-[13px] font-bold text-muted">{meta}</span>
        <span className="card-swap text-[22px] font-extrabold leading-[1.18] tracking-[-0.025em]">
          <span className="card-swap-a line-clamp-3">{post.title}</span>
          <span className="card-swap-b line-clamp-3 text-[17px] font-semibold leading-[1.45] tracking-normal text-body" aria-hidden="true">
            {post.summary}
          </span>
        </span>
        <span className="mt-auto flex items-center gap-2 pt-2 text-[15px] font-extrabold">
          Read the article
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </span>
      </span>
    </Link>
  );
}
