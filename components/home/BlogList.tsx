import Link from 'next/link';
import { LineReveal } from '@/components/home/LineReveal';
import { ArrowIcon } from '@/components/home/icons';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { EmailForm } from '@/components/ui/EmailForm';
import type { Post } from '@/lib/posts';

export function BlogList({ posts }: { posts: Pick<Post, 'slug' | 'title' | 'topic' | 'date'>[] }) {
  return (
    <section aria-labelledby="blog-h" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-32 max-[480px]:px-4">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <LineReveal
          id="blog-h"
          className="m-0 text-[clamp(44px,6vw,80px)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          lines={[{ text: 'Lessons,' }, { text: 'written down.' }]}
        />
        <Button href="/blog" variant="outline" className="!font-extrabold">
          All posts
        </Button>
      </div>

      {posts.length === 0 ? (
        <Reveal className="flex max-w-[560px] flex-col gap-4 border-t-[1.5px] border-ink pt-8">
          <p className="m-0 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em]">First post coming Saturday.</p>
          <EmailForm source="home" labelClassName="text-muted" />
        </Reveal>
      ) : (
        <div className="flex flex-col">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 80} as="div">
            <Link
              href={`/blog/${post.slug}`}
              className={`row flex flex-wrap items-center gap-x-8 gap-y-4 border-t-[1.5px] border-ink py-[30px] text-ink no-underline transition-colors duration-300 hover:bg-white ${
                index === posts.length - 1 ? 'border-b-[1.5px]' : ''
              }`}
            >
              <span className="w-14 text-[18px] font-extrabold text-muted">{String(index + 1).padStart(2, '0')}</span>
              <span className="w-[200px] text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted">{post.topic}</span>
              <span className="shift min-w-0 flex-[1_1_360px] text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em]">
                {post.title}
              </span>
              <ArrowIcon size={32} />
            </Link>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
