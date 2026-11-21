import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AskChat } from '@/components/askme/AskChat';
import { BinduMark } from '@/components/brand/BinduMark';
import { EmailForm } from '@/components/ui/EmailForm';
import { ListenButton } from '@/components/post/ListenButton';
import { LiteYouTube } from '@/components/post/LiteYouTube';
import { closingQuestion, NotionBlocks } from '@/components/post/NotionBlocks';
import { ProgressBar } from '@/components/post/ProgressBar';
import { ReadNext } from '@/components/post/ReadNext';
import { RichTextView } from '@/components/post/RichText';
import { ShareButton } from '@/components/post/ShareButton';
import { TldrBox } from '@/components/post/TldrBox';
import { Toc } from '@/components/post/Toc';
import { formatPostDate } from '@/lib/format';
import { getAllPosts, getPost, getReadNext, postOutline } from '@/lib/posts';
import { JsonLd } from '@/components/seo/JsonLd';
import { brandedTitle, metaDescription, pageMetadata, postJsonLd } from '@/lib/seo';
import { site } from '@/lib/site';
import { youtubeId } from '@/lib/youtube';

type Props = { params: Promise<{ slug: string }> };

const emptySlug = '__empty';

export function generateStaticParams() {
  const posts = getAllPosts().map((post) => ({ slug: post.slug }));
  return posts.length > 0 ? posts : [{ slug: emptySlug }];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = slug === emptySlug ? null : getPost(slug);
  if (!post) {
    return pageMetadata({
      title: 'Post | The Chaithanya',
      description: site.description,
      path: '/insights',
      index: false,
    });
  }
  return pageMetadata({
    title: brandedTitle(post.seoTitle || post.title),
    description: metaDescription(post.summary),
    path: `/insights/${post.slug}`,
    ogImage: `/og/${post.slug}.png`,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.lastEdited || post.date,
    section: post.topic,
    tags: post.tags,
    markdown: `/insights/${post.slug}.md`,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = slug === emptySlug ? null : getPost(slug);
  if (!post) notFound();

  const outline = postOutline(post);
  const question = closingQuestion(post.blocks);
  const video = post.videoUrl ? youtubeId(post.videoUrl) : '';
  const next = getReadNext(post.slug, 3);
  const spoken = [post.title, post.summary, ...post.tldr, post.plainText].filter(Boolean).join('\n\n');
  const meta = [
    formatPostDate(post.date),
    `${post.readingMinutes} min read`,
    post.week !== null ? `Week ${post.week}` : '',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <JsonLd data={postJsonLd(post)} />
      <ProgressBar />
      <article id="post">
        <header className="mx-auto flex w-full max-w-page flex-col gap-7 px-5 pt-16 min-[861px]:pt-[72px] max-[480px]:px-4">
          <nav aria-label="Breadcrumb" className="flex gap-2 text-sm font-bold text-muted">
            <Link href="/insights" className="text-muted">
              Insights
            </Link>
            <span aria-hidden="true">/</span>
            <span>{post.topic}</span>
          </nav>
          <h1 className="m-0 max-w-[1050px] text-[clamp(44px,6.4vw,96px)] font-extrabold leading-[0.96] tracking-[-0.05em]">
            {post.title}
            <span className="blink ml-[0.04em] inline-block h-[0.18em] w-[0.18em] rounded-full bg-ink" />
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink">
                <BinduMark size={28} tone="cloud" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[16px] font-extrabold">{site.author}</span>
                <span className="text-sm font-semibold text-muted">{meta}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <ListenButton text={spoken} />
              <ShareButton title={post.title} />
            </div>
          </div>
        </header>

        {video ? (
          <div className="mx-auto w-full max-w-page px-5 pt-12 max-[480px]:px-4">
            <div className="relative aspect-[16/8] overflow-hidden rounded-[28px] bg-indigo [background-image:radial-gradient(rgba(240,238,233,0.12)_1.5px,transparent_1.5px)] [background-size:22px_22px]">
              <LiteYouTube videoId={video} />
            </div>
          </div>
        ) : null}

        <div className="mx-auto flex w-full max-w-page flex-wrap items-start gap-14 px-5 pt-16 max-[480px]:px-4">
          <aside aria-label="On this page" className="flex w-full max-w-[280px] flex-1 basis-60 flex-col gap-5 min-[861px]:sticky min-[861px]:top-28">
            <Toc items={outline.items} />
            <AskChat
              slug={post.slug}
              question={`Tell me about ${post.title}`}
              className="lift flex flex-col gap-2.5 rounded-[20px] bg-ink p-5 text-cloud"
            >
              <span className="text-[12px] font-extrabold tracking-[0.08em] text-muted-dark">ASK ABOUT THIS POST</span>
              <span className="text-[17px] font-extrabold leading-snug">Stuck on a step? Ask, and get an answer from this post.</span>
              <span className="text-sm font-extrabold text-saffron">Start a chat →</span>
            </AskChat>
          </aside>
          <div className="flex min-w-0 max-w-[760px] flex-[999_1_560px] flex-col gap-7">
            <TldrBox lines={post.tldr} />
            <NotionBlocks blocks={post.blocks} stealIds={outline.stealIds} imageAlt={post.title} />
            {question || post.tags.length > 0 ? (
              <div className="flex flex-col gap-3.5 border-t-[1.5px] border-ink pt-7">
                {question ? (
                  <p className="m-0 text-[24px] font-extrabold leading-snug text-ink">
                    <RichTextView parts={question.richText} />
                  </p>
                ) : null}
                {post.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-line bg-white px-3.5 py-2 text-sm font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </article>

      <section aria-labelledby="sub-h" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-28 max-[480px]:px-4">
        <div className="flex flex-wrap items-end justify-between gap-8 rounded-[36px] bg-saffron px-6 py-12 text-coal min-[861px]:px-14 min-[861px]:py-16">
          <h2 id="sub-h" className="m-0 flex-[1_1_420px] text-[clamp(40px,5.4vw,76px)] font-extrabold leading-[0.95] tracking-[-0.05em]">
            Liked this?
            <br />
            Get next week&apos;s.
          </h2>
          <div className="min-w-0 flex-[1_1_400px]">
            <EmailForm source="post" layout="band" />
          </div>
        </div>
      </section>

      <ReadNext posts={next} />
    </>
  );
}
