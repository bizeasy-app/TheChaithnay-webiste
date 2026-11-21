export const steps = [
  {
    number: '01',
    title: 'Try it first',
    text: "Pick a real problem — mine or a small business's — and test a new tool on it.",
  },
  {
    number: '02',
    title: 'Build with AI',
    text: 'Ship fast with AI tools like Claude Code. Small, testable steps.',
  },
  {
    number: '03',
    title: 'Test with real people',
    text: 'Put it in front of real users and watch what actually happens.',
  },
  {
    number: '04',
    title: 'Share what I learned',
    text: 'What worked and what failed, written up so you can use it.',
  },
];

export function HowIBuild() {
  return (
    <section aria-labelledby="how-h" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-32 max-[480px]:px-4">
      <h2 id="how-h" className="mb-8 mt-0 text-[clamp(44px,6vw,80px)] font-extrabold leading-[0.95] tracking-[-0.05em]">
        How I build<span className="text-saffron">.</span>
      </h2>
      <ol className="m-0 grid list-none gap-4 p-0 min-[861px]:grid-cols-4">
        {steps.map((step) => (
          <li
            key={step.number}
            className={`flex flex-col gap-2.5 border-t-2 pt-5 ${step.number === '04' ? 'border-saffron' : 'border-ink'}`}
          >
            <span className="text-[15px] font-extrabold text-muted">{step.number}</span>
            <span className="text-[26px] font-extrabold tracking-[-0.03em]">{step.title}</span>
            <span className="text-[16px] leading-[1.55] text-body">{step.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
