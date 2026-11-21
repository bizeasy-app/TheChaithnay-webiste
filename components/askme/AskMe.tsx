'use client';

import { useEffect, useRef, useState } from 'react';
import { AskMePanel } from '@/components/askme/AskMePanel';
import { onAsk, openAsk, type AskRequest } from '@/components/askme/open-ask';

export function AskMe() {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<AskRequest>({});
  const [ticket, setTicket] = useState(0);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    return onAsk((next) => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setRequest(next);
      setTicket((current) => current + 1);
      setOpen(true);
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('ask-open', open);
  }, [open]);

  function close() {
    setOpen(false);
    const back = returnFocus.current;
    window.setTimeout(() => {
      // The island's question field is gone once the panel opens; land on its Ask button instead.
      const target = back?.isConnected ? back : document.querySelector<HTMLElement>('.island-ask');
      target?.focus();
    }, 0);
  }

  return (
    <>
      <AskMePanel open={open} ticket={ticket} question={request.question} slug={request.slug} onClose={close} />
    </>
  );
}
