'use client';

import { useEffect, useRef, useState } from 'react';
import { AskMeButton } from '@/components/askme/AskMeButton';
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

  function close() {
    setOpen(false);
    const back = returnFocus.current;
    window.setTimeout(() => back?.focus(), 0);
  }

  return (
    <>
      <AskMeButton
        open={open}
        onClick={(event) => {
          if (open) close();
          else {
            openAsk();
            returnFocus.current = event.currentTarget;
          }
        }}
      />
      <AskMePanel open={open} ticket={ticket} question={request.question} slug={request.slug} onClose={close} />
    </>
  );
}
