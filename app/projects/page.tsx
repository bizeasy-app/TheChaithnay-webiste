import type { Metadata } from 'next';
import { steps } from '@/components/projects/HowIBuild';
import { IdeaBox } from '@/components/projects/IdeaBox';
import { LockedCard, ProjectCard } from '@/components/projects/ProjectCard';
import { Reveal } from '@/components/motion/Reveal';
import { SplitPage, StackNav } from '@/components/split/StackNav';
import { projects } from '@/content/projects';
import { EmailForm } from '@/components/ui/EmailForm';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Projects | The Chaithanya',
  description: 'Products, experiments, case studies and technical demos — built in public, with what worked and what failed. First projects open here soon.',
  path: '/projects',
});

export default function ProjectsPage() {
  return (
    <>
      <SplitPage
        nav={
          <StackNav current="projects">
            <h1 className="m-0 inline text-[17px] font-medium">Projects</h1>: products, experiments, case studies and technical
            demos — shown honestly, with what worked and what failed.
          </StackNav>
        }
      >
        <div className="feed-in flex flex-col gap-3" style={{ ['--i' as string]: 0 }}>
          <EmailForm source="products" tag="product-launch" layout="pill" label="Be first to see new projects" buttonLabel="Notify me" />
        </div>

        <div className="mt-8 flex items-baseline justify-between gap-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted">
          <span>{projects.length ? 'Showcase' : 'In the lab'}</span>
          <span className="font-mono font-medium">{String(projects.length).padStart(2, '0')}</span>
        </div>

        <div className="mt-4 flex flex-col gap-5">
          {projects.length
            ? projects.map((project, index) => <ProjectCard key={project.name} project={project} index={index} />)
            : [0, 1, 2].map((index) => <LockedCard key={index} index={index} />)}
        </div>

        <section aria-labelledby="how-h" className="mt-16">
          <h2 id="how-h" className="m-0 mb-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted">
            How I build
          </h2>
          <ol className="m-0 flex list-none flex-col p-0">
            {steps.map((step, index) => (
              <Reveal as="li" key={step.number} delay={index * 60} className="row-wipe flex gap-5 border-t border-line py-5 last:border-b">
                <span className="font-mono text-[12px] font-medium text-muted">{step.number}</span>
                <span className="flex flex-col gap-1">
                  <span className="text-[22px] font-extrabold tracking-[-0.025em]">{step.title}</span>
                  <span className="text-[15px] leading-[1.5] text-body">{step.text}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </section>
      </SplitPage>
      <IdeaBox />
    </>
  );
}
