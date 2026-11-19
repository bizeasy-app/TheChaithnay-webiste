'use client';

import { useId, useState } from 'react';
import { BinduMark } from '@/components/brand/BinduMark';
import { openAsk } from '@/components/askme/open-ask';
import { Magnetic } from '@/components/motion/Magnetic';

const suggestions = ['Who is Chaithanya?', 'Where do I start?', 'Best AI tools for founders'];

export function AskBar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId();
  const [question, setQuestion] = useState('');

  function ask(value: string) {
    const next = value.trim();
    if (!next) return;
    openAsk({ question: next });
    setQuestion('');
  }

  return (
    <form
      className={`flex min-w-0 flex-[1_1_460px] flex-col gap-3 ${className ?? ''}`}
      style={style}
      onSubmit={(event) => {
        event.preventDefault();
        ask(question);
      }}
    >
      <label htmlFor={id} className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted">
        Ask me anything
      </label>
      <div className="field-shell gap-2 py-2 pl-5 pr-2 shadow-float transition duration-300 focus-within:shadow-[0_0_0_3px_rgba(232,121,43,0.35),0_20px_50px_rgba(26,23,20,0.28)]">
        <BinduMark size={22} tone="cloud" />
        <input
          id={id}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="How do you build apps with AI?"
          className="min-h-11 min-w-0 flex-1 bg-transparent py-2.5 text-[17px] font-medium text-cloud"
        />
        <Magnetic strength={0.4}>
          <button
            type="submit"
            aria-label="Ask"
            className="press row inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-saffron text-ink transition duration-300 hover:scale-110"
          >
            <svg
              className="arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </Magnetic>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => ask(item)}
            className="chip-in press inline-flex min-h-11 items-center rounded-full border-[1.5px] border-line-strong px-3.5 text-sm font-bold transition duration-300 hover:-translate-y-1 hover:border-ink hover:bg-ink hover:text-cloud"
            style={{ animationDelay: `${620 + index * 90}ms` }}
          >
            {item}
          </button>
        ))}
      </div>
    </form>
  );
}
