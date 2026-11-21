'use client';

import { Suspense, useId, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { openAsk } from '@/components/askme/open-ask';
import type { FeaturedCard } from '@/components/insights/FeaturedPost';
import { NoteCard } from '@/components/insights/NoteCard';
import type { PostCardData } from '@/components/insights/PostCard';
import { SeriesList } from '@/components/insights/SeriesGrid';
import { SplitPage, StackNav } from '@/components/split/StackNav';
import { EmailForm } from '@/components/ui/EmailForm';
import { topicBySlug, topics } from '@/lib/topics';

export type BlogCard = FeaturedCard & PostCardData & { featured: boolean };

function BlogView({
  posts,
  topic,
  query,
  onQuery,
  onTopic,
}: {
  posts: BlogCard[];
  topic: string;
  query: string;
  onQuery: (value: string) => void;
  onTopic: (slug: string) => void;
}) {
  const askId = useId();
  const current = topicBySlug(topic);
  const needle = query.trim().toLowerCase();
  const visible = posts.filter((post) => {
    if (current && post.topic !== current.label) return false;
    if (!needle) return true;
    return post.title.toLowerCase().includes(needle) || post.summary.toLowerCase().includes(needle);
  });

  return (
    <SplitPage
      nav={
        <StackNav current="insights">
          <h1 className="m-0 inline text-[17px] font-medium">Insights</h1> on technology, AI, business and productivity —
          opinions, tutorials and lessons from real experiments. One new article every week.
        </StackNav>
      }
    >
      <form
        className="feed-in flex flex-col gap-4"
        style={{ ['--i' as string]: 0 }}
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const question = query.trim();
          if (question) openAsk({ question });
        }}
      >
        <label htmlFor={askId} className="sr-only">
          Search insights, or ask a question
        </label>
        <div className="feed-search flex items-center gap-3 rounded-[18px] border border-line bg-white py-1.5 pl-5 pr-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="shrink-0 text-muted">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4.3-4.3" />
          </svg>
          <input
            id={askId}
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="search, or ask a question"
            className="min-w-0 flex-1 bg-transparent py-3 text-[16px] text-ink outline-none placeholder:text-placeholder"
          />
          <button
            type="submit"
            aria-label="Ask"
            data-magnetic="0.3"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-saffron text-coal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <div role="group" aria-label="Filter by pillar" className="feed-tabs flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
          {[{ slug: '', short: 'All' }, ...topics].map((item) => {
            const active = (current?.slug ?? '') === item.slug;
            return (
              <button
                key={item.slug || 'all'}
                type="button"
                aria-pressed={active}
                onClick={() => onTopic(item.slug)}
                className={`feed-tab${active ? ' is-active' : ''}`}
              >
                {item.short}
              </button>
            );
          })}
        </div>
      </form>

      <div className="mt-8 flex items-baseline justify-between gap-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted">
        <span>{current ? current.label : 'All articles'}</span>
        <span className="font-mono font-medium" aria-live="polite">
          {String(visible.length).padStart(2, '0')}
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="feed-in mt-4 flex flex-col gap-5 rounded-[24px] border-2 border-dashed border-line-strong p-7" style={{ ['--i' as string]: 1 }}>
          <p className="m-0 text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em]">The first article is on its way.</p>
          <p className="m-0 text-[16px] leading-[1.55] text-body">One new article every week. Get them in your inbox:</p>
          <EmailForm source="blog" labelClassName="text-muted" />
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-4 flex flex-col items-start gap-4 rounded-[24px] border-2 border-dashed border-line-strong p-7">
          <p className="m-0 text-[24px] font-extrabold">No articles match that.</p>
          {query.trim() ? (
            <button
              type="button"
              onClick={() => openAsk({ question: query.trim() })}
              className="press inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-[15px] font-bold text-cloud"
            >
              Ask me instead →
            </button>
          ) : null}
        </div>
      ) : (
        <div key={`${topic}|${needle}`} className="mt-4 flex flex-col gap-5">
          {visible.map((post, index) => (
            <NoteCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      )}

      <SeriesList />
    </SplitPage>
  );
}

function BlogFromUrl({ posts }: { posts: BlogCard[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const topic = params.get('topic') ?? '';

  return (
    <BlogView
      posts={posts}
      topic={topic}
      query={query}
      onQuery={setQuery}
      onTopic={(slug) => router.replace(slug ? `/insights?topic=${slug}` : '/insights', { scroll: false })}
    />
  );
}

export function BlogScreen({ posts }: { posts: BlogCard[] }) {
  return (
    <Suspense fallback={<BlogView posts={posts} topic="" query="" onQuery={() => undefined} onTopic={() => undefined} />}>
      <BlogFromUrl posts={posts} />
    </Suspense>
  );
}
