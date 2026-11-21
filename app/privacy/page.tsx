import type { Metadata } from 'next';
import { mailAddress } from '@/lib/links';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy policy | The Chaithanya',
  description: 'How The Chaithanya handles your email and messages.',
  path: '/privacy',
});

export default function PrivacyPage() {
  const email = mailAddress(site.contactEmail);
  const contact = email ? <a href={`mailto:${email}`}>{email}</a> : site.contactEmail;

  return (
    <article className="mx-auto flex w-full max-w-[760px] flex-col gap-8 px-5 pb-8 pt-16 min-[861px]:pt-[88px] max-[480px]:px-4">
      <header className="flex flex-col gap-4">
        <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted">Privacy</p>
        <h1 className="m-0 text-[clamp(44px,6vw,72px)] font-extrabold leading-[0.95] tracking-[-0.05em]">
          What I keep, and why.
        </h1>
        <p className="m-0 text-[16px] font-semibold text-muted">Last updated 19 November 2026.</p>
      </header>

      <p className="m-0 text-[18px] leading-[1.6] text-body">
        This page says what this site collects. It is written in plain language. It is not legal advice, and it should be reviewed before you rely on it.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[28px] font-extrabold tracking-[-0.03em]">What I collect</h2>
        <p className="m-0 text-[18px] leading-[1.6] text-body">
          When you subscribe to the newsletter, I keep your email. If you add a first name, I keep that too.
        </p>
        <p className="m-0 text-[18px] leading-[1.6] text-body">
          When you send a message, or an idea from the projects page, I keep your name, your email, the reason you wrote, and the message.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[28px] font-extrabold tracking-[-0.03em]">Why</h2>
        <p className="m-0 text-[18px] leading-[1.6] text-body">
          The email is so I can send the newsletter every two weeks. The message is so I can reply.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[28px] font-extrabold tracking-[-0.03em]">Where it is stored</h2>
        <p className="m-0 text-[18px] leading-[1.6] text-body">
          Emails and messages are stored in Notion. Notion processes that data for this site. The site is hosted on Cloudflare.
        </p>
        <p className="m-0 text-[18px] leading-[1.6] text-body">
          Cloudflare Web Analytics counts visits. It does not use cookies.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[28px] font-extrabold tracking-[-0.03em]">Unsubscribe or delete</h2>
        <p className="m-0 text-[18px] leading-[1.6] text-body">
          Email {contact} and ask to unsubscribe, or ask me to delete what I hold about you. I will remove it from Notion.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[28px] font-extrabold tracking-[-0.03em]">The law</h2>
        <p className="m-0 text-[18px] leading-[1.6] text-body">
          India&apos;s Digital Personal Data Protection Act, 2023 gives you the right to know what I hold and to ask for it to be deleted.
        </p>
      </section>
    </article>
  );
}
