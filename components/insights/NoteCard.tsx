'use client';

import Link from 'next/link';
import { BinduMark } from '@/components/brand/BinduMark';
import { formatPostDate } from '@/lib/format';
import { topicSlug, topicBySlug } from '@/lib/topics';
import { youtubeId } from '@/lib/youtube';
import type { PostCardData } from '@/components/insights/PostCard';

function webpSources(url: string) {
  if (!url.endsWith('-1200.webp')) return undefined;
  return `${url.replace(/-1200\.webp$/, '-600.webp')} 600w, ${url} 1200w`;
}

/**
 * Feed card for the Insights column: cover, title, one line, then the pillar
 * tag and READ. Cover eases closer and READ's arrow slides on hover.
 */
export function NoteCard({ post, index = 0 }: { post: PostCardData; index?: number }) {
  const id = post.videoUrl ? youtubeId(post.videoUrl) : '';
  const cover = post.cover || (id ? `https://i.ytimg.com/vi/${id}/hq720.jpg` : '');
  const fallback = id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : '';
  const pillar = topicBySlug(topicSlug(post.topic))?.short ?? post.topic;
  const meta = [formatPostDate(post.date), post.readingMinutes ? `${post.readingMinutes} min` : ''].filter(Boolean).join(' · ');

  return (
    <Link
      href={`/insights/${post.slug}`}
      data-cursor="Read"
      className="note-card card-in group flex flex-col overflow-hidden rounded-[24px] border border-line bg-white text-ink no-underline"
      style={{ ['--i' as string]: index }}
    >
      <span className="relative m-3 mb-0 block aspect-[16/10] overflow-hidden rounded-[16px] bg-indigo">
        {cover ? (
          <img
            src={cover}
            srcSet={post.cover ? webpSources(post.cover) : undefined}
            sizes="(max-width: 1024px) 100vw, 600px"
            alt=""
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            onError={(event) => {
              const img = event.currentTarget;
              if (fallback && img.src !== fallback) img.src = fallback;
            }}
            className="note-card-img h-full w-full object-cover"
          />
        ) : (
          <span className="note-card-img flex h-full w-full items-center justify-center [background-image:radial-gradient(rgba(240,238,233,0.14)_1.5px,transparent_1.5px)] [background-size:20px_20px]">
            <BinduMark size={80} tone="paper" />
          </span>
        )}
      </span>
      <span className="flex flex-col gap-2 px-6 pb-5 pt-5">
        <span className="text-[24px] font-extrabold leading-[1.15] tracking-[-0.03em]">{post.title}</span>
        {post.summary ? <span className="line-clamp-2 text-[16px] leading-[1.5] text-body">{post.summary}</span> : null}
        <span className="mt-3 flex items-center justify-between gap-4 border-t border-line pt-4 text-[12px] font-extrabold uppercase tracking-[0.12em]">
          <span className="flex items-center gap-3 text-muted">
            <span className="text-saffron">{pillar}</span>
            {meta ? <span className="font-bold normal-case tracking-normal">{meta}</span> : null}
          </span>
          <span className="flex items-center gap-2">
            Read
            <span className="note-arrow inline-block" aria-hidden="true">
              →
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}
