'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { EmailForm } from '@/components/ui/EmailForm';
import { Marquee } from '@/components/ui/Marquee';
import { Pill } from '@/components/ui/Pill';
import { SectionLabel } from '@/components/ui/SectionLabel';

const topics = ['All', 'Startup lessons', 'AI tools & building', 'Money & investing', 'Life & mindset'];

export function UiGallery() {
  const [topic, setTopic] = useState('All');

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-16 px-5 py-16 max-[480px]:px-4">
      <header className="flex flex-col gap-3">
        <SectionLabel blink>UI kit</SectionLabel>
        <h1 className="m-0 text-[clamp(44px,6vw,80px)] font-extrabold leading-[0.95] tracking-[-0.05em]">
          Components.
        </h1>
        <p className="m-0 max-w-[520px] text-[17px] leading-[1.55] text-body">
          This page is not linked from the site. The live form posts to /api/subscribe, which is not deployed yet, so it shows the error state.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-[26px] font-extrabold tracking-[-0.03em]">Button</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ink">Join the log</Button>
          <Button variant="saffron" size="lg">
            Subscribe
          </Button>
          <Button variant="outline">All posts</Button>
          <span className="inline-flex rounded-full bg-saffron p-2">
            <Button variant="cloud">Subscribe</Button>
          </span>
          <Button variant="ink" disabled>
            Sending…
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-[26px] font-extrabold tracking-[-0.03em]">Pill</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Pill>New</Pill>
          <Pill tone="saffron">In the lab</Pill>
          <Pill tone="white">Claude Code</Pill>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-[26px] font-extrabold tracking-[-0.03em]">Chip</h2>
        <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
          {topics.map((item) => (
            <Chip key={item} pressed={topic === item} onClick={() => setTopic(item)}>
              {item}
            </Chip>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-[26px] font-extrabold tracking-[-0.03em]">Card and label</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <SectionLabel>The story</SectionLabel>
            <p className="m-0 mt-3 text-[26px] font-extrabold leading-[1.1] tracking-[-0.03em]">No face. Just the build.</p>
          </Card>
          <Card>
            <SectionLabel blink>The weekly founder log</SectionLabel>
            <p className="m-0 mt-3 text-[17px] leading-[1.55] text-body">One log. Every Saturday.</p>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-[26px] font-extrabold tracking-[-0.03em]">Marquee</h2>
      </section>
      <Marquee
        items={['Founder log', 'AI tools & building', 'Startup lessons', 'Money & mindset', 'Steal this', "Here's what actually happened"]}
      />

      <section className="flex flex-col gap-8">
        <h2 className="m-0 text-[26px] font-extrabold tracking-[-0.03em]">Email form</h2>
        <div className="rounded-[36px] bg-ink p-8 sm:p-14">
          <EmailForm source="home" />
        </div>
        <div className="rounded-[36px] bg-saffron p-8 sm:p-14">
          <EmailForm source="post" layout="band" />
        </div>
        <div className="max-w-[420px] rounded-[22px] bg-ink-2 p-8">
          <EmailForm source="newsletter" layout="card" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[22px] bg-ink p-6">
            <p className="mb-3 text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted-dark">Loading</p>
            <EmailForm source="home" previewState="loading" />
          </div>
          <div className="rounded-[22px] bg-ink p-6">
            <p className="mb-3 text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted-dark">Success</p>
            <EmailForm source="home" previewState="success" />
          </div>
          <div className="rounded-[22px] bg-ink p-6">
            <p className="mb-3 text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted-dark">Error</p>
            <EmailForm source="home" previewState="error" />
          </div>
        </div>
      </section>
    </div>
  );
}
