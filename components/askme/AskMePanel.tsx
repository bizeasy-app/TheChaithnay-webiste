'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { BinduMark } from '@/components/brand/BinduMark';
import { FALLBACK, matchQuestion, type AnswerLink, type FaqIndex } from '@/components/askme/matcher';

const GREETING = "Hi! Ask me who Chaithanya is, what he's building, or where to start on the blog.";

const CHIPS = [
  'Who is Chaithanya?',
  'What are you building?',
  'Where do I start on the blog?',
  'How do I get the newsletter?',
];

type Message = {
  role: 'user' | 'bot';
  text: string;
  links?: AnswerLink[];
};

const contactLink: AnswerLink = { href: '/newsletter#contact', title: 'Contact', topic: 'Send a message' };

function LinkCard({ link, onClose }: { link: AnswerLink; onClose: () => void }) {
  const className = 'flex w-full flex-col gap-1 rounded-2xl border border-line bg-white px-3.5 py-3 text-ink no-underline';
  const body = (
    <>
      <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-muted">{link.topic}</span>
      <span className="text-[15px] font-extrabold leading-snug">{link.title}</span>
    </>
  );
  if (link.href.startsWith('/')) {
    return (
      <Link href={link.href} className={className} onClick={onClose}>
        {body}
      </Link>
    );
  }
  return (
    <a href={link.href} className={className} rel="noopener noreferrer" target="_blank" onClick={onClose}>
      {body}
    </a>
  );
}

export function AskMePanel({
  open,
  ticket,
  question,
  slug,
  onClose,
}: {
  open: boolean;
  ticket: number;
  question?: string;
  slug?: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const inputId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<FaqIndex | null>(null);
  const seenTicket = useRef(0);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: GREETING }]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (open) dialog.querySelector<HTMLInputElement>('input')?.focus();

    // Lenis owns page wheel events; pause it so the panel can scroll.
    const lenis = window.__lenis;
    if (open) lenis?.stop();
    else lenis?.start();
    return () => {
      lenis?.start();
    };
  }, [open]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
  }, [messages, open]);

  async function index() {
    if (indexRef.current) return indexRef.current;
    const response = await fetch('/faq-index.json');
    if (!response.ok) throw new Error('The answer list did not load.');
    const data = (await response.json()) as FaqIndex;
    indexRef.current = data;
    return data;
  }

  async function ask(raw: string, scope?: string) {
    const text = raw.trim();
    if (!text) return;
    setInput('');
    setMessages((current) => [...current, { role: 'user', text }]);
    try {
      const data = await index();
      const answer = matchQuestion(text, data, scope);
      setMessages((current) => [...current, { role: 'bot', text: answer.text, links: answer.links }]);
    } catch {
      setMessages((current) => [...current, { role: 'bot', text: FALLBACK, links: [contactLink] }]);
    }
  }

  useEffect(() => {
    if (!open || !question || ticket === 0 || ticket === seenTicket.current) return;
    seenTicket.current = ticket;
    void ask(question, slug);
  }, [open, ticket, question, slug]);

  return (
    <dialog
      ref={dialogRef}
      id="ask-me"
      aria-modal="true"
      aria-labelledby={titleId}
      className="ask-dialog"
      data-lenis-prevent
      onClose={onClose}
    >
      <div className="flex h-full min-h-0 w-full flex-col bg-cloud text-ink" data-lenis-prevent>
        <div className="flex items-center gap-3 bg-ink px-5 py-[18px] text-cloud">
          <BinduMark size={38} tone="cloud" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span id={titleId} className="text-[17px] font-extrabold tracking-[-0.02em]">
              Ask The Chaithanya
            </span>
            <span className="text-[13px] font-medium text-muted-dark">Quick answers from this site</span>
          </div>
          <button
            type="button"
            aria-label="Close assistant"
            onClick={onClose}
            className="focus-on-ink inline-flex h-11 w-11 items-center justify-center rounded-full text-cloud"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div
          ref={scrollerRef}
          aria-live="polite"
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="ask-scroller flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-5"
        >
          {messages.map((message, index) =>
            message.role === 'user' ? (
              <div
                key={`${message.role}-${index}`}
                className="max-w-[80%] self-end rounded-[18px] rounded-br-[4px] bg-ink px-4 py-3 text-[15px] font-semibold leading-normal text-cloud"
              >
                {message.text}
              </div>
            ) : (
              <div key={`${message.role}-${index}`} className="flex w-full flex-col items-start gap-2">
                <div className="max-w-[86%] rounded-[18px] rounded-bl-[4px] border border-line bg-white px-4 py-3 text-[15px] font-medium leading-[1.55] text-ink">
                  {message.text}
                </div>
                {message.links?.map((link) => (
                  <LinkCard key={link.href} link={link} onClose={onClose} />
                ))}
              </div>
            ),
          )}
        </div>

        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => void ask(chip, slug)}
              className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-line-strong px-3.5 text-[13px] font-bold"
            >
              {chip}
            </button>
          ))}
        </div>

        <form
          className="flex items-center gap-2 border-t border-line bg-white px-4 py-3"
          onSubmit={(event) => {
            event.preventDefault();
            void ask(input, slug);
          }}
        >
          <label htmlFor={inputId} className="sr-only">
            Ask a question
          </label>
          <input
            id={inputId}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about Chaithanya, products, the blog…"
            className="min-w-0 flex-1 rounded-full border-[1.5px] border-line-strong bg-cloud px-4 py-[13px] text-[15px] text-ink outline-none"
          />
          <button
            type="submit"
            aria-label="Send"
            className="inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-saffron text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </div>
    </dialog>
  );
}
