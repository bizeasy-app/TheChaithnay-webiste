import Link from 'next/link';
import { BinduMark } from '@/components/brand/BinduMark';
import { PlayIcon } from '@/components/home/icons';
import { Reveal } from '@/components/motion/Reveal';
import { VideoTile } from '@/components/home/VideoTile';
import { externalUrl, youtubeId } from '@/lib/links';
import { site } from '@/lib/site';

/** Proof, after the promise: the latest video and what's being built. */
export function Bento() {
  const videoUrl = externalUrl(site.latestVideo.url);
  const [headline, detail] = site.latestVideo.title.split(' · ');
  const videoId = videoUrl ? youtubeId(videoUrl) : null;
  const videoClass =
    'group lift relative flex min-h-[440px] h-full flex-col justify-between overflow-hidden rounded-[28px] bg-indigo p-8 text-paper no-underline [background-image:radial-gradient(rgba(240,238,233,0.12)_1.5px,transparent_1.5px)] [background-size:22px_22px] min-[861px]:p-10';

  const video = (
    <>
      <span className="self-start text-[15px] font-bold text-on-indigo">Latest video, week {site.latestVideo.week}</span>
      <span className="flex h-24 w-24 items-center justify-center self-center rounded-full bg-paper text-coal transition duration-500 group-hover:scale-110">
        <PlayIcon />
      </span>
      <span className="flex flex-col gap-2">
        <span className="max-w-[18ch] text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.06] tracking-[-0.035em]">{headline}</span>
        <span className="text-[15px] font-semibold text-on-indigo">{detail ?? 'Watch on YouTube'}</span>
      </span>
    </>
  );

  return (
    <section aria-labelledby="work-h" className="mx-auto w-full max-w-page px-5 pt-20 min-[861px]:pt-36 max-[480px]:px-4">
      <h2 id="work-h" className="m-0 mb-10 text-[clamp(40px,5.4vw,72px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
        Real work, in public
      </h2>
      <div className="grid grid-cols-1 items-stretch gap-4 min-[861px]:grid-cols-[1.7fr_1fr]">
        <Reveal>
          {videoId ? (
            <VideoTile
              id={videoId}
              week={site.latestVideo.week}
              headline={headline}
              detail={detail}
              className="fx-wipe"
            />
          ) : videoUrl ? (
            <a href={videoUrl} className={`${videoClass} fx-wipe`} target="_blank" rel="noopener noreferrer" data-cursor="Play">
              {video}
            </a>
          ) : (
            <div className={`${videoClass} fx-wipe`}>{video}</div>
          )}
        </Reveal>
        <Reveal delay={120}>
          <Link
            href="/projects"
            data-cursor="Peek"
            className="lift flex h-full min-h-[300px] flex-col justify-between gap-6 rounded-[28px] border-2 border-dashed border-line-strong p-7 text-ink no-underline min-[861px]:p-8"
          >
            <span className="text-[15px] font-bold text-muted">In the lab</span>
            <BinduMark size={88} blink className="self-center" />
            <span className="flex flex-col gap-3">
              <span className="text-[clamp(24px,2.3vw,32px)] font-extrabold leading-[1.08] tracking-[-0.03em]">
                Products and experiments, built in the open.
              </span>
              <span className="text-[15px] font-extrabold underline decoration-saffron decoration-2 underline-offset-4">
                See what I&apos;m building
              </span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
