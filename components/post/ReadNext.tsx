import Link from 'next/link';
import type { Post } from '@/lib/posts';

export function ReadNext({ posts }: { posts: Pick<Post, 'slug' | 'title' | 'topic'>[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="next-h" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-28 max-[480px]:px-4">
      <h2 id="next-h" className="mb-6 mt-0 text-[clamp(36px,4.6vw,64px)] font-extrabold leading-[0.95] tracking-[-0.05em]">
        Read next
      </h2>
      <div className="grid gap-4 min-[861px]:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="lift flex min-h-[200px] flex-col gap-3 rounded-3xl border border-line bg-white p-7 text-ink no-underline"
          >
            <span className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted">{post.topic}</span>
            <span className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em]">{post.title}</span>
            <span className="mt-auto text-[15px] font-extrabold">Read →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
