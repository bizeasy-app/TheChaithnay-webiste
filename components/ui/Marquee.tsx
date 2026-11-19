type MarqueeProps = {
  items: string[];
  paused?: boolean;
};

export function Marquee({ items, paused = false }: MarqueeProps) {
  const sequence = items.flatMap((item, index) => [
    <span key={`${item}-${index}`}>{item}</span>,
    <span key={`${item}-${index}-dot`} className="text-saffron">
      ●
    </span>,
  ]);

  return (
    <div aria-hidden="true" className="ml-[-2%] w-[104%] overflow-hidden bg-ink py-[22px] text-cloud [transform:rotate(-1.2deg)]">
      <div className={`marquee flex w-max gap-10 whitespace-nowrap text-[28px] font-extrabold tracking-[-0.02em]${paused ? ' is-paused' : ''}`}>
        <span className="flex gap-10">{sequence}</span>
        <span className="flex gap-10">{sequence}</span>
      </div>
    </div>
  );
}
