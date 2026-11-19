'use client';

import { useEffect, useState } from 'react';

export function ProgressBar() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const article = document.getElementById('post');
      if (!article) return;
      const start = article.getBoundingClientRect().top + window.scrollY;
      const scrolled = window.scrollY + 32 - start;
      const total = Math.max(article.offsetHeight - window.innerHeight * 0.35, 1);
      setValue(Math.max(0, Math.min(100, Math.round((scrolled / total) * 100))));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="sticky top-0 z-40 h-1 bg-[rgba(26,23,20,0.08)]"
    >
      <div className="h-1 bg-saffron" style={{ width: `${value}%` }} />
    </div>
  );
}
