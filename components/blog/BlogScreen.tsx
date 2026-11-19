'use client';

import { Suspense, useId, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { openAsk } from '@/components/askme/open-ask';
import { FeaturedPost, type FeaturedCard } from '@/components/blog/FeaturedPost';
import { PostRow } from '@/components/blog/PostRow';
import { TopicFilter } from '@/components/blog/TopicFilter';
import { BinduMark } from '@/components/brand/BinduMark';
import { EmailForm } from '@/components/ui/EmailForm';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { topicBySlug } from '@/lib/topics';

export type BlogCard = FeaturedCard & { featured: boolean };

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
  const featured = posts.find((post) => post.featured) ?? posts[0] ?? null;
  const topicLabel = topicBySlug(topic)?.label ?? '';
  const needle = query.trim().toLowerCase();
  const visible = posts.filter((post) => {
    if (topicLabel && post.topic !== topicLabel) return false;
    if (!needle) return true;
    return post.title.toLowerCase().includes(needle) || post.summary.toLowerCase().includes(needle);
  });

  return (
    <>
      <section aria-labelledby="blog-h" className="mx-auto flex w-full max-w-page flex-col gap-8 px-5 pt-16 min-[861px]:pt-[88px] max-[480px]:px-4">
        <SectionLabel blink className="tracking-[0.1em]">
          The blog
        </SectionLabel>
        <h1 id="blog-h" className="m-0 text-[clamp(56px,9.6vw,150px)] font-extrabold leading-[0.92] tracking-[-0.055em]">
          Founder log
          <br />
          &amp; lessons<span className="text-saffron">.</span>
        </h1>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="m-0 max-w-[500px] flex-[1_1_380px] text-[21px] font-medium leading-normal text-body">
            Every video, written down — plus what doesn&apos;t fit in a video. Simple words, real numbers, no hype.
          </p>
          <form
            className="flex min-w-0 flex-[1_1_460px] flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const question = query.trim();
              if (question) openAsk({ question });
            }}
          >
            <label htmlFor={askId} className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted">
              Search or ask the blog
            </label>
            <div className="flex items-center gap-2 rounded-full bg-ink py-2 pl-5 pr-2 shadow-float">
              <BinduMark size={22} tone="cloud" />
              <input
                id={askId}
                value={query}
                onChange={(event) => onQuery(event.target.value)}
                placeholder="e.g. How do I start building with AI?"
                className="min-w-0 flex-1 bg-transparent py-3 text-[17px] text-cloud outline-none"
              />
              <button
                type="submit"
                aria-label="Ask"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-saffron text-ink"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="mx-auto w-full max-w-page px-5 pt-16 max-[480px]:px-4">
          <div className="flex max-w-[560px] flex-col gap-4">
            <p className="m-0 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em]">First post coming Saturday.</p>
            <EmailForm source="blog" labelClassName="text-muted" />
          </div>
        </section>
      ) : (
        <>
          {featured ? (
            <section aria-label="Featured" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-[72px] max-[480px]:px-4">
              <FeaturedPost post={featured} />
            </section>
          ) : null}
          <section aria-labelledby="all-h" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-28 max-[480px]:px-4">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
              <h2 id="all-h" className="m-0 text-[clamp(44px,6vw,80px)] font-extrabold leading-[0.95] tracking-[-0.05em]">
                All posts
              </h2>
              <TopicFilter topic={topic} onChange={onTopic} />
            </div>
            {visible.length === 0 ? (
              <p className="m-0 border-t-[1.5px] border-ink pt-8 text-[24px] font-extrabold">No posts match that.</p>
            ) : (
              <div className="flex flex-col border-b-[1.5px] border-ink">
                {visible.map((post, index) => (
                  <PostRow
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    number={String(index + 1).padStart(2, '0')}
                    topic={post.topic}
                    title={post.title}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
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
      onTopic={(slug) => router.replace(slug ? `/blog?topic=${slug}` : '/blog', { scroll: false })}
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
