'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { contact } from '@/lib/contact';

const SUCCESS = 'Got it. I’ll read this.';
const ERROR = "That didn't work. Try again in a minute.";

export function IdeaBox() {
  const id = useId();
  const [idea, setIdea] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) return;
    const website = String(new FormData(event.currentTarget).get('website') ?? '');
    setStatus('loading');
    const result = await contact({
      name: 'Idea',
      email: '',
      reason: 'Suggest an experiment',
      message: idea.trim(),
      website,
    });
    setStatus(result.ok ? 'success' : 'error');
  }

  return (
    <section aria-labelledby="idea-h" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-32 max-[480px]:px-4">
      <div className="flex flex-wrap items-center justify-between gap-10 overflow-hidden rounded-[36px] bg-saffron px-6 py-12 text-coal min-[861px]:px-14 min-[861px]:py-16">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5">
          <h2 id="idea-h" className="m-0 text-[clamp(40px,5.4vw,76px)] font-extrabold leading-[0.95] tracking-[-0.05em]">
            What should I
            <br />
            try next?
          </h2>
          <p className="m-0 text-[18px] font-semibold leading-[1.55]">
            Suggest a tool, skill or experiment. The best ideas become a Build Notes experiment.
          </p>
        </div>
        {status === 'success' ? (
          <p role="status" className="m-0 min-w-0 flex-[1_1_400px] text-[18px] font-extrabold">
            {SUCCESS}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex min-w-0 flex-[1_1_400px] flex-col gap-3">
            <div aria-hidden="true">
              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
                className="absolute h-px w-px overflow-hidden"
                style={{ left: '-9999px' }}
              />
            </div>
            <label htmlFor={id} className="text-sm font-extrabold">
              Your idea
            </label>
            <div className="field-shell field-shell-on-saffron flex-wrap gap-2 py-2 pl-5 pr-2 max-[480px]:rounded-[28px] max-[480px]:p-2.5">
              <input
                id={id}
                name="idea"
                type="text"
                required
                minLength={10}
                maxLength={5000}
                value={idea}
                disabled={status === 'loading'}
                aria-describedby={status === 'error' ? `${id}-status` : undefined}
                onChange={(event) => setIdea(event.target.value)}
                placeholder="e.g. Build an app in 24 hours"
                className="min-h-11 min-w-0 flex-[1_1_180px] bg-transparent py-2.5 pr-2 text-[16px] font-medium text-cloud max-[480px]:basis-full max-[480px]:px-3"
              />
              <Button
                type="submit"
                variant="cloud"
                size="lg"
                disabled={status === 'loading'}
                className="shrink-0 max-[480px]:w-full max-[480px]:basis-full"
              >
                {status === 'loading' ? 'Sending…' : 'Send idea'}
              </Button>
            </div>
            {status === 'error' ? (
              <p id={`${id}-status`} role="alert" aria-live="assertive" className="m-0 text-sm font-bold">
                {ERROR}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
