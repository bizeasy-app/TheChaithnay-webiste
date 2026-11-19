type WordmarkProps = {
  className?: string;
};

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={`text-[18px] leading-none tracking-[-0.035em] ${className ?? ''}`}>
      <span className="font-medium text-muted">The </span>
      <span className="font-bold text-ink">Chaithanya</span>
    </span>
  );
}
