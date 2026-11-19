import { BinduMark } from '@/components/brand/BinduMark';

function LockIcon({ stroke = '#1A1714' }: { stroke?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

const locked = [
  { number: '01', tone: 'light' as const, titleWidth: 'w-[70%]', lineWidth: 'w-[90%]' },
  { number: '02', tone: 'light' as const, titleWidth: 'w-[60%]', lineWidth: 'w-[85%]' },
  { number: '03', tone: 'indigo' as const, titleWidth: 'w-[65%]', lineWidth: 'w-[88%]' },
];

export function LabBento() {
  return (
    <section aria-labelledby="lab-h" className="mx-auto w-full max-w-page px-5 pt-16 min-[861px]:pt-24 max-[480px]:px-4">
      <h2 id="lab-h" className="sr-only">
        Coming soon
      </h2>
      <div className="grid gap-4 min-[861px]:grid-cols-4 min-[861px]:[grid-auto-rows:minmax(240px,auto)]">
        <div className="relative flex min-h-[480px] flex-col justify-between overflow-hidden rounded-[28px] bg-ink p-7 text-cloud [background-image:radial-gradient(rgba(240,238,233,0.08)_1.5px,transparent_1.5px)] [background-size:24px_24px] min-[861px]:col-span-2 min-[861px]:row-span-2 min-[861px]:p-10">
          <BinduMark
            size={440}
            tone="cloud"
            className="spin pointer-events-none absolute -bottom-[110px] -right-[110px] opacity-20"
          />
          <span className="relative self-start rounded-full bg-saffron px-3 py-1.5 text-[13px] font-extrabold tracking-[0.04em] text-ink">
            IN THE LAB
          </span>
          <span className="relative flex flex-col gap-3.5">
            <span className="text-[clamp(40px,4.4vw,64px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
              Several products.
              <br />
              One founder.
              <br />
              <span className="text-saffron">Built with AI.</span>
            </span>
            <span className="max-w-[440px] text-[17px] leading-[1.55] text-[#D9D2C9]">
              Each one becomes a story on the founder log. They open here one by one.
            </span>
          </span>
        </div>

        {locked.map((card) => (
          <article
            key={card.number}
            className={`lift flex flex-col justify-between overflow-hidden rounded-[28px] p-7 ${
              card.tone === 'indigo' ? 'bg-indigo text-cloud' : 'border border-line bg-white text-ink'
            }`}
          >
            <span className="flex items-center justify-between">
              <span className={`text-[18px] font-extrabold ${card.tone === 'indigo' ? 'text-on-indigo' : 'text-muted'}`}>
                {card.number}
              </span>
              <LockIcon stroke={card.tone === 'indigo' ? '#F0EEE9' : '#1A1714'} />
            </span>
            <span className="flex flex-col gap-2.5">
              <span
                aria-hidden="true"
                className={`h-[22px] rounded-md ${card.titleWidth} ${card.tone === 'indigo' ? 'bg-[#3A4472]' : 'bg-line'}`}
              />
              <span
                aria-hidden="true"
                className={`h-3 rounded-md ${card.lineWidth} ${card.tone === 'indigo' ? 'bg-[#323C68]' : 'bg-[#EEEAE3]'}`}
              />
              <span className="text-[15px] font-extrabold">Coming soon</span>
            </span>
          </article>
        ))}

        <article className="lift flex flex-col justify-between overflow-hidden rounded-[28px] border-2 border-dashed border-line-strong p-7">
          <span className="text-[18px] font-extrabold text-muted">04+</span>
          <span className="flex flex-col gap-1.5">
            <span className="text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em]">
              More in the lab
              <span className="blink ml-1.5 inline-block h-2 w-2 rounded-full bg-saffron" />
            </span>
            <span className="text-[15px] font-semibold text-muted">Revealed on the founder log.</span>
          </span>
        </article>
      </div>
    </section>
  );
}
