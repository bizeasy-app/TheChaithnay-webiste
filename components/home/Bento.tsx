import Link from 'next/link';
import { BinduMark } from '@/components/brand/BinduMark';
import { AskTile } from '@/components/home/AskTile';
import { ArrowIcon, PlayIcon } from '@/components/home/icons';
import { Reveal } from '@/components/motion/Reveal';
import { externalUrl } from '@/lib/links';
import { site } from '@/lib/site';

const socials = [
  { label: 'YouTube', detail: 'Weekly founder log', href: externalUrl(site.socials.youtube) },
  { label: 'Instagram', detail: '3 Reels a week', href: externalUrl(site.socials.instagram) },
  { label: 'X', detail: 'Build notes', href: externalUrl(site.socials.x) },
  { label: 'LinkedIn', detail: 'Founder lessons', href: externalUrl(site.socials.linkedin) },
];

export function Bento() {
  const videoUrl = externalUrl(site.latestVideo.url);
  const videoClass =
    'group lift ink-wash relative flex min-h-[420px] h-full flex-col justify-between overflow-hidden rounded-[28px] bg-indigo p-8 text-cloud no-underline [background-image:radial-gradient(rgba(240,238,233,0.12)_1.5px,transparent_1.5px)] [background-size:22px_22px]';

  const video = (
    <>
      <span className="self-start rounded-full bg-ink px-3 py-1.5 text-[13px] font-extrabold tracking-[0.04em]">
        LATEST VIDEO
      </span>
      <span className="flex h-24 w-24 items-center justify-center self-center rounded-full bg-cloud text-ink transition duration-500 group-hover:scale-110">
        <PlayIcon />
      </span>
      <span className="flex flex-col gap-2">
        <span className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.035em]">
          Founder log, week {site.latestVideo.week}:{' '}
          <span className="text-saffron">here&apos;s what actually happened.</span>
        </span>
        <span className="text-[15px] font-semibold text-on-indigo">{site.latestVideo.title}</span>
      </span>
    </>
  );

  return (
    <section aria-label="Highlights" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-24 max-[480px]:px-4">
      <div className="grid grid-cols-1 gap-4 min-[861px]:auto-rows-[minmax(250px,auto)] min-[861px]:grid-cols-4">
        <Reveal delay={0} className="min-[861px]:col-span-2 min-[861px]:row-span-2">
          {videoUrl ? (
            <a href={videoUrl} className={`${videoClass} fx-wipe`} target="_blank" rel="noopener noreferrer">
              {video}
            </a>
          ) : (
            <div className={`${videoClass} fx-wipe`}>{video}</div>
          )}
        </Reveal>

        <Reveal delay={90} className="min-[861px]:col-span-2">
          <div className="lift ink-wash flex h-full flex-col gap-3.5 rounded-[28px] border border-line bg-white p-8">
            <span className="text-[13px] font-extrabold tracking-[0.08em] text-muted">THE STORY</span>
            <h2 className="m-0 text-[40px] font-extrabold leading-[1.02] tracking-[-0.04em]">No face. Just the build.</h2>
            <p className="m-0 text-[17px] leading-[1.6] text-body">
              I&apos;m Chaithanya — a solo founder with a team of ten, building with tools like Claude Code. Chaitanya means awareness: the
              dot where something begins.
            </p>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <Link href="/newsletter" className="lift ink-wash flex h-full flex-col justify-between rounded-[28px] bg-saffron p-7 text-ink no-underline">
            <span className="text-[13px] font-extrabold tracking-[0.08em]">NEWSLETTER</span>
            <span className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.035em]">
              One log.
              <br />
              Every Saturday.
            </span>
            <span className="text-[16px] font-extrabold">Subscribe →</span>
          </Link>
        </Reveal>

        <Reveal delay={200}>
          <AskTile />
        </Reveal>

        <Reveal delay={240} className="min-[861px]:col-span-2">
          <div className="flex h-full flex-col rounded-[28px] border border-line bg-white px-7 py-3">
            {socials.map((item, index) => {
              const rowClass = `row flex items-center justify-between gap-3 py-4 text-ink no-underline ${
                index < socials.length - 1 ? 'border-b border-line' : ''
              }`;
              const content = (
                <>
                  <span className="shift text-[22px] font-extrabold tracking-[-0.02em]">{item.label}</span>
                  <span className="flex items-center gap-3 text-[15px] font-semibold text-muted">
                    {item.detail}
                    <ArrowIcon />
                  </span>
                </>
              );
              return item.href ? (
                <a key={item.label} href={item.href} className={rowClass} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={item.label} className={rowClass}>
                  {content}
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={300} className="min-[861px]:col-span-2">
          <Link
            href="/products"
            className="lift ink-wash flex h-full flex-wrap items-center gap-7 rounded-[28px] border-2 border-dashed border-line-strong p-8 text-ink no-underline"
          >
            <BinduMark size={96} blink />
            <span className="flex min-w-[240px] flex-1 flex-col gap-2">
              <span className="text-[13px] font-extrabold tracking-[0.08em] text-muted">BUILDING IN PUBLIC</span>
              <span className="text-[32px] font-extrabold leading-[1.05] tracking-[-0.035em]">Products drop here soon.</span>
              <span className="text-[16px] font-bold">Get notified →</span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
