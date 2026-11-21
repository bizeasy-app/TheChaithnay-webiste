import { BinduMark } from '@/components/brand/BinduMark';
import { Reveal } from '@/components/motion/Reveal';
import type { Project, ProjectStatus } from '@/content/projects';
import { externalUrl } from '@/lib/links';

const STATUS: Record<ProjectStatus, { label: string; dot: string }> = {
  live: { label: 'Live', dot: 'bg-[#3FA463]' },
  building: { label: 'Building', dot: 'bg-saffron blink' },
  idea: { label: 'Idea', dot: 'bg-muted-dark' },
};

const TILES = {
  ink: 'from-[#2a2521] to-[#0e0c0b] text-paper',
  indigo: 'from-[#38457f] to-[#1a2142] text-paper',
  saffron: 'from-[#f29a55] to-[#c45f17] text-coal',
  white: 'from-[#ffffff] to-[#d9d4cb] text-coal',
} as const;

/**
 * Showcase card: small name at the top, a big rounded "app tile" rising from
 * the bottom edge. On hover the tile lifts and tilts, and a soft glow rises.
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const href = project.url ? externalUrl(project.url) : '';
  const status = STATUS[project.status];
  const tile = TILES[project.tone ?? 'ink'];

  const body = (
    <>
      <span className="relative z-10 flex flex-col items-center gap-1 px-6 pt-5 text-center">
        <span className="text-[15px] font-bold lowercase tracking-[-0.01em] text-body">{project.name}</span>
        <span className="pc-line text-[13px] leading-[1.4] text-muted">{project.oneLiner}</span>
      </span>
      <span className="pc-stage relative mt-4 flex h-[220px] items-end justify-center overflow-hidden min-[481px]:h-[260px]">
        <span className="pc-glow" aria-hidden="true" />
        <span className={`pc-tile relative flex aspect-square w-[58%] max-w-[280px] items-center justify-center overflow-hidden rounded-[22%] bg-gradient-to-b ${tile}`}>
          {project.image ? (
            <img src={project.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[clamp(56px,9vw,96px)] font-extrabold leading-none tracking-[-0.06em]">
              {project.name.slice(0, 1)}
              <span className="text-saffron">.</span>
            </span>
          )}
        </span>
      </span>
      <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
        {status.label}
      </span>
      <span className="absolute right-4 top-4 z-10 font-mono text-[11px] font-medium text-muted">
        {String(index + 1).padStart(2, '0')}
        {project.year ? ` · ${project.year}` : ''}
      </span>
    </>
  );

  const className = 'project-card relative flex flex-col overflow-hidden rounded-[24px] border border-line bg-white text-ink no-underline';

  return (
    <Reveal delay={(index % 2) * 80}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" data-cursor="Visit" className={className} aria-label={`${project.name}: ${project.oneLiner}. ${status.label}. Opens in a new tab.`}>
          {body}
        </a>
      ) : (
        <article className={className} aria-label={`${project.name}: ${project.oneLiner}. ${status.label}.`}>
          {body}
        </article>
      )}
    </Reveal>
  );
}

/** Same card shape while the lab is still closed: an honest locked tile. */
export function LockedCard({ index }: { index: number }) {
  return (
    <Reveal delay={(index % 2) * 80}>
      <article data-cursor="Soon" className="project-card relative flex flex-col overflow-hidden rounded-[24px] border border-dashed border-line-strong bg-white text-ink">
        <span className="relative z-10 flex flex-col items-center gap-1 px-6 pt-5 text-center">
          <span className="text-[15px] font-bold lowercase text-body">project {String(index + 1).padStart(2, '0')}</span>
          <span className="text-[13px] text-muted">In the lab — coming soon</span>
        </span>
        <span className="pc-stage relative mt-4 flex h-[220px] items-end justify-center overflow-hidden min-[481px]:h-[260px]">
          <span className="pc-glow" aria-hidden="true" />
          <span className="pc-tile pc-locked relative flex aspect-square w-[58%] max-w-[280px] items-center justify-center rounded-[22%] border border-line-strong">
            <BinduMark size={88} blink={index === 0} />
          </span>
        </span>
      </article>
    </Reveal>
  );
}
