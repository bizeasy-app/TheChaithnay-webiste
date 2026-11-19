import Link from 'next/link';
import { AskChat } from '@/components/askme/AskChat';
import { BinduMark } from '@/components/brand/BinduMark';

export type FeaturedCard = {
  slug: string;
  title: string;
  titleHighlight: string;
  topic: string;
  summary: string;
  videoUrl: string;
};

function Title({ title, highlight }: { title: string; highlight: string }) {
  if (!highlight) return title;
  const index = title.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) return title;
  return (
    <>
      {title.slice(0, index)}
      <span className="text-saffron">{title.slice(index, index + highlight.length)}</span>
      {title.slice(index + highlight.length)}
    </>
  );
}

export function FeaturedPost({ post }: { post: FeaturedCard }) {
  return (
    <div className="grid gap-4 min-[861px]:grid-cols-4 min-[861px]:[grid-auto-rows:minmax(240px,auto)]">
      <Link
        href={`/blog/${post.slug}`}
        className="lift relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-[28px] bg-indigo p-7 text-cloud no-underline [background-image:radial-gradient(rgba(240,238,233,0.12)_1.5px,transparent_1.5px)] [background-size:22px_22px] min-[861px]:col-span-3 min-[861px]:row-span-2 min-[861px]:p-10"
      >
        <BinduMark size={420} tone="cloud" className="pointer-events-none absolute -right-[90px] -top-[60px] opacity-[0.22]" />
        <span className="relative flex flex-wrap gap-2 self-start">
          <span className="rounded-full bg-ink px-3 py-1.5 text-[13px] font-extrabold tracking-[0.04em]">FEATURED</span>
          {post.videoUrl ? (
            <span className="rounded-full border border-[rgba(240,238,233,0.4)] px-3 py-1.5 text-[13px] font-bold">With video</span>
          ) : null}
        </span>
        <span className="relative flex max-w-[720px] flex-col gap-3.5">
          <span className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-on-indigo">{post.topic}</span>
          <span className="text-[clamp(36px,4.4vw,60px)] font-extrabold leading-none tracking-[-0.045em]">
            <Title title={post.title} highlight={post.titleHighlight} />
          </span>
          <span className="text-[17px] leading-[1.55] text-on-indigo-soft">{post.summary}</span>
          <span className="text-[16px] font-extrabold">Read the log →</span>
        </span>
      </Link>
      <Link
        href="/newsletter"
        className="lift flex min-h-[240px] flex-col justify-between rounded-[28px] bg-saffron p-7 text-ink no-underline"
      >
        <span className="text-[13px] font-extrabold tracking-[0.08em]">EVERY SATURDAY</span>
        <span className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.035em]">Get new posts in your inbox.</span>
        <span className="text-[16px] font-extrabold">Subscribe →</span>
      </Link>
      <AskChat className="lift flex min-h-[240px] flex-col justify-between gap-3 rounded-[28px] bg-ink p-7 text-cloud" question="Pick a post for me">
        <span className="text-[13px] font-extrabold tracking-[0.08em] text-muted-dark">NOT SURE WHERE TO START?</span>
        <span className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.03em]">
          Ask me to pick a post for you
          <span className="blink ml-1.5 inline-block h-[9px] w-[9px] rounded-full bg-saffron" />
        </span>
        <span className="text-[16px] font-extrabold">Start a chat →</span>
      </AskChat>
    </div>
  );
}
