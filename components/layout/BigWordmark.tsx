const WORD = 'Chaithanya';

/** Footer wordmark: letters rise in a wave as the footer is uncovered (--p from ScrollFX). */
export function BigWordmark() {
  return (
    <p
      aria-hidden="true"
      className="wordmark-rise m-0 overflow-hidden whitespace-nowrap pb-[0.06em] text-[clamp(64px,15vw,230px)] font-extrabold leading-[0.8] tracking-[-0.06em] text-ink"
    >
      {[...WORD].map((letter, index) => (
        <span key={index} className="wordmark-letter" style={{ ['--i' as string]: index }}>
          {letter}
        </span>
      ))}
      <span className="wordmark-letter text-saffron" style={{ ['--i' as string]: WORD.length }}>
        .
      </span>
    </p>
  );
}
