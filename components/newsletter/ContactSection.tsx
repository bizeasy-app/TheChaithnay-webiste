'use client';

import { useId, useState } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { contact, contactReasons, type ContactReason } from '@/lib/contact';
import { externalUrl, mailAddress } from '@/lib/links';
import { site } from '@/lib/site';

const SUCCESS = 'Got it. Thanks for writing.';
const ERROR = "That didn't work. Try again in a minute.";

const messageHints: Record<ContactReason, string> = {
  Collaboration: 'What are we building? Add a link if you have one.',
  Sponsorship: 'What is the product, who is it for, and what do you need?',
  'Podcast or interview': 'Show name, rough date, and the topic you want.',
  'Suggest an experiment': 'What should I try next — a tool, skill, or build?',
  'Just saying hi': 'Say hi. Tell me what you’re working on.',
};

const socials = [
  { label: 'YouTube', href: externalUrl(site.socials.youtube) },
  { label: 'Instagram', href: externalUrl(site.socials.instagram) },
  { label: 'X', href: externalUrl(site.socials.x) },
  { label: 'LinkedIn', href: externalUrl(site.socials.linkedin) },
].filter((item): item is { label: string; href: string } => Boolean(item.href));

export function ContactSection() {
  const id = useId();
  const email = mailAddress(site.contactEmail);
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [reason, setReason] = useState<ContactReason>(contactReasons[0]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) return;
    const website = String(new FormData(event.currentTarget).get('website') ?? '');
    setStatus('loading');
    const result = await contact({
      name: name.trim(),
      email: mail.trim(),
      reason,
      message: message.trim(),
      website,
    });
    setStatus(result.ok ? 'success' : 'error');
  }

  const statusId = `${id}-status`;
  const describedBy = status === 'error' ? statusId : undefined;
  const field =
    'field-light w-full border-transparent bg-cloud shadow-[inset_0_0_0_1.5px_var(--line-strong)] hover:shadow-[inset_0_0_0_1.5px_var(--muted)] focus-visible:shadow-[inset_0_0_0_1.5px_var(--ink),0_0_0_3px_rgba(232,121,43,0.28)]';

  return (
    <section id="contact" aria-labelledby="ct-h" className="mx-auto w-full max-w-page scroll-mt-28 px-5 pt-16 min-[861px]:pt-28 max-[480px]:px-4">
      <Reveal className="overflow-hidden rounded-[36px] border border-line bg-white shadow-[0_24px_60px_rgba(26,23,20,0.06)]">
        <div className="grid min-[961px]:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="relative flex flex-col justify-between gap-10 overflow-hidden bg-ink px-6 py-10 text-cloud [background-image:radial-gradient(rgba(240,238,233,0.08)_1.5px,transparent_1.5px)] [background-size:22px_22px] min-[861px]:px-10 min-[861px]:py-12">
            <div className="relative flex flex-col gap-5">
              <p className="m-0 flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.14em] text-muted-dark">
                <span className="inline-block h-2 w-2 rounded-full bg-saffron" aria-hidden="true" />
                Connect
              </p>
              <h2
                id="ct-h"
                className="m-0 text-[clamp(36px,4.4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]"
              >
                Write me.
                <br />
                I read every note.
              </h2>
              <p className="m-0 max-w-[36ch] text-[17px] leading-[1.6] text-on-indigo-soft">
                Collab, sponsor, podcast, or an idea for the next experiment. Pick a reason, say what you need, and send it.
              </p>
            </div>

            <div className="relative flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="m-0 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted-dark">What’s it about?</p>
                <div className="flex flex-wrap gap-2">
                  {contactReasons.map((item) => {
                    const active = reason === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setReason(item)}
                        className={`press inline-flex min-h-11 items-center rounded-full px-3.5 text-[13px] font-bold transition duration-300 ${
                          active
                            ? 'bg-saffron text-ink'
                            : 'border border-[rgba(240,238,233,0.18)] text-on-indigo hover:border-cloud hover:text-cloud'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="m-0 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted-dark">Email</p>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="group press inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-cloud px-5 text-[15px] font-extrabold text-ink no-underline transition duration-300 hover:-translate-y-0.5"
                  >
                    {email}
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-cloud transition duration-300 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                ) : (
                  <p className="m-0 text-[16px] font-semibold text-muted-dark">{site.contactEmail}</p>
                )}
              </div>

              {socials.length ? (
                <div className="flex flex-col gap-3">
                  <p className="m-0 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted-dark">Follow the build</p>
                  <nav aria-label="Social" className="flex flex-wrap gap-x-4 gap-y-2">
                    {socials.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="draw inline-flex min-h-11 items-center text-[14px] font-bold text-on-indigo hover:text-cloud"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              ) : null}
            </div>
          </div>

          <div className="px-6 py-10 min-[861px]:px-10 min-[861px]:py-12">
            {status === 'success' ? (
              <div
                role="status"
                className="flex h-full min-h-[320px] flex-col items-start justify-center gap-4 rounded-[28px] bg-cloud px-6 py-8"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-saffron text-[22px] font-extrabold text-ink">
                  ✓
                </span>
                <p className="m-0 text-[28px] font-extrabold leading-tight tracking-[-0.03em]">{SUCCESS}</p>
                <p className="m-0 max-w-[32ch] text-[16px] leading-[1.55] text-body">
                  I reply by email when I can. Usually within a few days.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex h-full flex-col gap-5">
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

                <div className="grid gap-4 min-[640px]:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor={`${id}-name`} className="text-[13px] font-extrabold uppercase tracking-[0.06em] text-muted">
                      Name
                    </label>
                    <input
                      id={`${id}-name`}
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      value={name}
                      disabled={status === 'loading'}
                      aria-describedby={describedBy}
                      onChange={(event) => setName(event.target.value)}
                      className={field}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor={`${id}-email`} className="text-[13px] font-extrabold uppercase tracking-[0.06em] text-muted">
                      Email
                    </label>
                    <input
                      id={`${id}-email`}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={mail}
                      disabled={status === 'loading'}
                      aria-describedby={describedBy}
                      onChange={(event) => setMail(event.target.value)}
                      className={field}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor={`${id}-reason`} className="text-[13px] font-extrabold uppercase tracking-[0.06em] text-muted">
                    What&apos;s it about?
                  </label>
                  <div className="relative">
                    <select
                      id={`${id}-reason`}
                      name="reason"
                      required
                      value={reason}
                      disabled={status === 'loading'}
                      onChange={(event) => setReason(event.target.value as ContactReason)}
                      className={`${field} appearance-none pr-12`}
                    >
                      {contactReasons.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
                      ▾
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor={`${id}-message`} className="text-[13px] font-extrabold uppercase tracking-[0.06em] text-muted">
                    Message
                  </label>
                  <textarea
                    id={`${id}-message`}
                    name="message"
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={6}
                    placeholder={messageHints[reason]}
                    value={message}
                    disabled={status === 'loading'}
                    aria-describedby={describedBy}
                    onChange={(event) => setMessage(event.target.value)}
                    className={`${field} min-h-[160px] resize-y`}
                  />
                </div>

                {status === 'error' ? (
                  <p id={statusId} role="alert" aria-live="assertive" className="m-0 text-sm font-bold text-ink">
                    {ERROR}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Button type="submit" variant="ink" size="lg" disabled={status === 'loading'} className="min-w-[180px]">
                    {status === 'loading' ? 'Sending…' : 'Send message'}
                  </Button>
                  <p className="m-0 max-w-[22ch] text-[13px] font-semibold leading-snug text-muted">
                    Goes to my inbox. Reply by email.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
