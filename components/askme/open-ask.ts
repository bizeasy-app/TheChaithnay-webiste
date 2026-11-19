export type AskRequest = {
  question?: string;
  slug?: string;
};

const EVENT = 'the-chaithanya:ask';

export function openAsk(request: AskRequest = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<AskRequest>(EVENT, { detail: request }));
}

export function onAsk(handler: (request: AskRequest) => void) {
  const listener = (event: Event) => {
    handler((event as CustomEvent<AskRequest>).detail ?? {});
  };
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
