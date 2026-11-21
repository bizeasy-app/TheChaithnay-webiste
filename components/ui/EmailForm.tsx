'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { subscribe, type SubscribeSource } from '@/lib/subscribe';

const SUCCESS = "You're on the list. The next issue lands in your inbox.";
const ERROR = "That didn't work. Try again in a minute.";

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

type EmailFormProps = {
  source: SubscribeSource;
  tag?: string;
  layout?: 'inline' | 'band' | 'card' | 'pill';
  label?: string;
  buttonLabel?: string;
  showFirstName?: boolean;
  labelClassName?: string;
  previewState?: FormStatus;
};

export function EmailForm({
  source,
  tag,
  layout = 'inline',
  label,
  buttonLabel,
  showFirstName,
  labelClassName,
  previewState,
}: EmailFormProps) {
  const reactId = useId();
  const id = `email-${reactId.replace(/:/g, '')}`;
  const [status, setStatus] = useState<FormStatus>(previewState ?? 'idle');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const withName = showFirstName ?? layout === 'card';
  const busy = status === 'loading';
  const onDark = layout === 'inline' || layout === 'card';

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (previewState) return;
    if (!event.currentTarget.checkValidity()) return;

    const website = String(new FormData(event.currentTarget).get('website') ?? '');
    setStatus('loading');
    const result = await subscribe({
      email,
      firstName: withName ? firstName : undefined,
      source,
      tag,
      website,
    });
    setStatus(result.ok ? 'success' : 'error');
  }

  if (status === 'success') {
    return (
      <p role="status" aria-live="polite" className={cn('m-0 text-[17px] font-bold', onDark ? 'text-cloud' : 'text-ink')}>
        {SUCCESS}
      </p>
    );
  }

  const statusId = `${id}-status`;

  return (
    <form onSubmit={onSubmit} className={cn('flex flex-col', layout === 'card' ? 'gap-3.5' : 'gap-2.5')} noValidate={false}>
      <div aria-hidden="true">
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
          className="absolute h-px w-px overflow-hidden"
          style={{ left: '-9999px' }}
        />
      </div>

      {layout === 'card' ? (
        <CardFields
          id={id}
          firstName={firstName}
          email={email}
          withName={withName}
          busy={busy}
          onFirstName={setFirstName}
          onEmail={setEmail}
          statusId={status === 'error' ? statusId : undefined}
        />
      ) : (
        <InlineFields
          id={id}
          layout={layout}
          label={label}
          labelClassName={labelClassName}
          email={email}
          busy={busy}
          onEmail={setEmail}
          buttonLabel={buttonLabel}
          statusId={status === 'error' ? statusId : undefined}
        />
      )}

      {layout === 'card' ? (
        <Button type="submit" variant="saffron" size="lg" disabled={busy} className="mt-1.5 w-full">
          {busy ? 'Sending…' : (buttonLabel ?? 'Subscribe free')}
        </Button>
      ) : null}

      {status === 'error' ? (
        <p id={statusId} role="alert" aria-live="assertive" className={cn('m-0 text-sm font-bold', onDark ? 'text-cloud' : 'text-ink')}>
          {ERROR}
        </p>
      ) : null}

      <p
        className={cn(
          'm-0 text-[13px]',
          layout === 'band' ? 'text-ink' : layout === 'pill' ? 'text-muted' : 'text-muted-dark',
          layout === 'card' && 'text-center',
        )}
      >
        {layout === 'card' ? 'Unsubscribe anytime with one click. ' : null}
        By subscribing you agree to the{' '}
        <Link href="/privacy" className="underline">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}

function InlineFields({
  id,
  layout,
  label,
  labelClassName,
  email,
  busy,
  onEmail,
  buttonLabel,
  statusId,
}: {
  id: string;
  layout: 'inline' | 'band' | 'pill';
  label?: string;
  labelClassName?: string;
  email: string;
  busy: boolean;
  onEmail: (value: string) => void;
  buttonLabel?: string;
  statusId?: string;
}) {
  const fieldLabel = label ?? (layout === 'band' ? 'Email address' : 'One free email every two weeks');

  return (
    <>
      <label
        htmlFor={`${id}-email`}
        className={cn(
          'text-sm font-bold',
          labelClassName ??
            (layout === 'band' ? 'font-extrabold text-ink' : layout === 'pill' ? 'uppercase tracking-[0.08em] text-muted' : 'text-muted-dark'),
        )}
      >
        {fieldLabel}
      </label>
      <div
        className={cn(
          'field-shell flex-wrap',
          layout === 'pill' ? 'py-2 pl-5 pr-2 shadow-float' : 'gap-2 p-2',
          layout === 'band' && 'field-shell-on-saffron',
          layout === 'inline' && 'border border-body bg-ink-input',
          'max-[480px]:rounded-[28px]',
        )}
      >
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          disabled={busy}
          aria-describedby={statusId}
          onChange={(event) => onEmail(event.target.value)}
          className={cn(
            'min-h-11 min-w-0 flex-[1_1_180px] bg-transparent py-2.5 text-cloud max-[480px]:basis-full max-[480px]:px-3',
            layout === 'pill' ? 'px-1 text-[17px] font-medium' : 'px-4 text-[16px] font-medium',
          )}
        />
        <Button
          type="submit"
          variant={layout === 'band' ? 'cloud' : 'saffron'}
          size={layout === 'pill' ? 'md' : 'lg'}
          disabled={busy}
          className={cn('shrink-0 max-[480px]:w-full max-[480px]:basis-full', layout === 'pill' && 'font-extrabold')}
        >
          {busy ? 'Sending…' : (buttonLabel ?? 'Subscribe')}
        </Button>
      </div>
    </>
  );
}

function CardFields({
  id,
  firstName,
  email,
  withName,
  busy,
  onFirstName,
  onEmail,
  statusId,
}: {
  id: string;
  firstName: string;
  email: string;
  withName: boolean;
  busy: boolean;
  onFirstName: (value: string) => void;
  onEmail: (value: string) => void;
  statusId?: string;
}) {
  return (
    <>
      {withName ? (
        <>
          <label htmlFor={`${id}-name`} className="text-sm font-bold text-muted-dark">
            First name
          </label>
          <input
            id={`${id}-name`}
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Your name"
            value={firstName}
            disabled={busy}
            onChange={(event) => onFirstName(event.target.value)}
            className="field-light w-full border-muted bg-ink text-cloud focus-visible:border-saffron focus-visible:shadow-[0_0_0_3px_rgba(232,121,43,0.28)]"
          />
        </>
      ) : null}
      <label htmlFor={`${id}-email`} className="text-sm font-bold text-muted-dark">
        Email address
      </label>
      <input
        id={`${id}-email`}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        disabled={busy}
        aria-describedby={statusId}
        onChange={(event) => onEmail(event.target.value)}
        className="field-light w-full border-muted bg-ink text-cloud focus-visible:border-saffron focus-visible:shadow-[0_0_0_3px_rgba(232,121,43,0.28)]"
      />
    </>
  );
}
