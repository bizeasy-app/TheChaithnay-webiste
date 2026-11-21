'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Film } from './storyFilm';

/**
 * The brand story as a short film, built on the story spine:
 * once upon a time, every day, one day, because of that, until finally.
 * The saffron dot is the main character and is on screen in every scene.
 */
const scenes = [
  { chapter: 'Dot', caption: 'Once upon a time, there was a dot.' },
  { chapter: 'Noise', caption: 'Every day, new tech flew past it.' },
  { chapter: 'Leap', caption: 'One day, it stopped watching and jumped in.' },
  { chapter: 'Fail', caption: 'It failed. A lot.' },
  { chapter: 'Learn', caption: 'So it learned, and tried again.' },
  { chapter: 'Share', caption: 'Then it shared everything it found.' },
  { chapter: 'Connect', caption: 'Until one day, the dots connected.' },
  { chapter: 'You', caption: 'Now it’s your turn.' },
];
const N = scenes.length;

/** Where the hero rests at the end of each scene, and how close the camera is. */
const rest = [
  { x: 400, y: 220, r: 11, cam: 1.8 }, // alone, in close-up
  { x: 400, y: 220, r: 11, cam: 1 }, // pull back: the noise around it
  { x: 575, y: 128, r: 14, cam: 1 }, // the leap
  { x: 400, y: 380, r: 14, cam: 1.06 }, // the fall
  { x: 262, y: 322, r: 14, cam: 1 }, // lands on the button it built
  { x: 400, y: 214, r: 50, cam: 0.94 }, // becomes the play button
  { x: 472, y: 230, r: 20.6, cam: 1.2 }, // the bindu, exactly where it sits in the logo
  { x: 300, y: 250, r: 20, cam: 1 }, // waiting for you
];

type Kind = 'sq' | 'tri' | 'ring' | 'bar';
/** New tech streaming past in scene 2: start x, y, size, shape, speed. */
const stream: [number, number, number, Kind, number][] = [
  [520, 90, 22, 'sq', 1.1],
  [760, 150, 16, 'ring', 1.4],
  [640, 310, 26, 'tri', 0.9],
  [900, 250, 14, 'sq', 1.6],
  [1020, 120, 30, 'bar', 1.2],
  [860, 360, 18, 'ring', 1],
  [1120, 200, 20, 'tri', 1.3],
  [1240, 330, 24, 'bar', 1.1],
  [1180, 70, 14, 'ring', 1.5],
];
const bars = [210, 150, 240, 110];
const wave = Array.from({ length: 18 }, (_, i) => Math.round(10 + Math.abs(Math.sin(i * 1.7)) * 26));

// The audience that gathers in scene 6, and the logo they form in scene 7.
const crowd = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2 + 0.3;
  const radius = 255 + ((i * 37) % 60);
  return [Math.round(400 + Math.cos(angle) * radius * 1.25), Math.round(214 + Math.sin(angle) * radius * 0.62)] as const;
});
const logoDots = crowd.map((_, i) => {
  const rad = ((48 + (i / (crowd.length - 1)) * 264) * Math.PI) / 180;
  return [Math.round((400 + Math.cos(rad) * 72) * 10) / 10, Math.round((230 + Math.sin(rad) * 72) * 10) / 10] as const;
});

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const bounce = (t: number) => {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t - 1.5 / d) ** 2 + 0.75;
  if (t < 2.5 / d) return n * (t - 2.25 / d) ** 2 + 0.9375;
  return n * (t - 2.625 / d) ** 2 + 0.984375;
};

function Shape({ kind, size }: { kind: Kind; size: number }) {
  const h = size / 2;
  if (kind === 'sq') return <rect x={-h} y={-h} width={size} height={size} rx={size * 0.22} className="fill-ink" />;
  if (kind === 'tri') return <path d={`M0 ${-h} L${h} ${h} L${-h} ${h} Z`} className="fill-ink" />;
  if (kind === 'ring') return <circle r={h} className="st-ring" />;
  return <rect x={-size} y={-size / 6} width={size * 2} height={size / 3} rx={size / 6} className="fill-ink" />;
}

export function Story() {
  const ref = useRef<HTMLElement>(null);
  const heroRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const cameraRef = useRef<SVGGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmRef = useRef<Film | null>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = ref.current;
    const hero = heroRef.current;
    const camera = cameraRef.current;
    if (!section || !hero || !camera) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const p = clamp(-rect.top / travel) * N;
      const k = Math.min(N - 1, Math.floor(p));
      const local = clamp(p - k);
      const style = section.style;
      progressRef.current = p;
      filmRef.current?.setProgress(p);

      for (let i = 0; i < N; i += 1) {
        const s = clamp(p - i);
        // Each scene plays in the first 55% of its scroll, then holds the shot.
        const a = reduce ? (s > 0 ? 1 : 0) : ease(clamp(s / 0.55));
        const fadeIn = i === 0 ? 1 : clamp(s / 0.12);
        const fadeOut = i === N - 1 ? 1 : clamp((1 - s) / 0.1);
        style.setProperty(`--a${i}`, a.toFixed(3));
        style.setProperty(`--s${i}`, (reduce ? 0.4 : s).toFixed(3));
        style.setProperty(`--v${i}`, (i === k ? Math.min(fadeIn, fadeOut) : 0).toFixed(3));
      }

      // The hero and the camera move from the last scene's shot to this one's.
      const t = reduce ? 1 : clamp(local / 0.45);
      const from = rest[Math.max(0, k - 1)];
      const to = rest[k];
      const move = k === 3 ? bounce(t) : ease(t);
      let x = k === 0 ? to.x : mix(from.x, to.x, move);
      let y = k === 0 ? to.y : mix(from.y, to.y, move);
      if (k === 2) y -= Math.sin(Math.PI * t) * 90; // the jump
      if (k === 1 && !reduce) x += Math.sin(local * 48) * 1.6; // nervous, watching it all go by
      const r = k === 0 ? to.r * clamp(local * 5 + 0.05) : mix(from.r, to.r, ease(t));
      hero.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${Math.max(0.01, r).toFixed(2)})`);
      glowRef.current?.setAttribute('opacity', clamp(1.4 - r / 40).toFixed(2));

      const cam = k === 0 ? to.cam - local * 0.15 : mix(from.cam - (k === 1 ? 0.15 : 0), to.cam, ease(t));
      camera.setAttribute('transform', `translate(400 220) scale(${cam.toFixed(3)}) translate(-400 -220)`);

      section.classList.toggle('story-shake', !reduce && k === 3 && local > 0.12 && local < 0.4);
      section.classList.toggle('story-end', k === N - 1 && local > 0.4);
      setActive((current) => (current === k ? current : k));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // The 3D film loads after the page, only where WebGL works and motion is welcome.
    // Until then (or without it) the SVG film plays.
    let cancelled = false;
    const canvas = canvasRef.current;
    const webgl = (() => {
      try {
        return Boolean(document.createElement('canvas').getContext('webgl2'));
      } catch {
        return false;
      }
    })();
    if (canvas && webgl && !reduce) {
      import('./storyFilm')
        .then(({ createFilm }) => {
          if (cancelled) return;
          const film = createFilm(canvas);
          film.setProgress(progressRef.current);
          filmRef.current = film;
          section.classList.add('story-3d');
        })
        .catch(() => section.classList.remove('story-3d'));
    }

    return () => {
      cancelled = true;
      filmRef.current?.dispose();
      filmRef.current = null;
      section.classList.remove('story-3d');
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const jump = (index: number) => {
    const section = ref.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    const y = top + travel * ((index + 0.6) / N);
    const lenis = (window as Window & { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section ref={ref} aria-labelledby="story-h" className="story">
      <h2 id="story-h" className="sr-only">
        A short film about trying new things
      </h2>
      <div className="story-stage">
        <span className="story-blur story-blur-top" aria-hidden="true" />
        <span className="story-blur story-blur-bottom" aria-hidden="true" />
        <span className="story-vignette" aria-hidden="true" />
        <span className="story-grain" aria-hidden="true" />
        <div className="story-inner mx-auto flex h-full w-full max-w-page flex-col items-center justify-center gap-5 px-5 max-[480px]:px-4">
          <p className="story-presents m-0" aria-hidden="true">
            A short film about trying new things
          </p>
          <div className="story-view">
          <canvas ref={canvasRef} className="story-canvas" aria-hidden="true" />
          <svg className="story-svg" viewBox="0 0 800 440" aria-hidden="true">
            <defs>
              <radialGradient id="story-glow">
                <stop offset="0%" stopColor="var(--saffron)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--saffron)" stopOpacity="0" />
              </radialGradient>
            </defs>

            <g ref={cameraRef}>
              {/* 1 · Dot: alone, a slow heartbeat */}
              <g style={{ opacity: 'var(--v0)' }}>
                {[34, 60, 88].map((radius, i) => (
                  <circle
                    key={radius}
                    cx="400"
                    cy="220"
                    r={radius}
                    className="st-ripple beat"
                    style={{ opacity: `calc(var(--a0) * ${0.5 - i * 0.14})`, animationDelay: `${i * -0.6}s` }}
                  />
                ))}
              </g>

              {/* 2 & 3 · Noise and Leap: new tech streams past */}
              <g style={{ opacity: 'max(var(--v1), calc(var(--v2) * 0.5))' }}>
                {stream.map(([x0, y, size, kind, speed], i) => (
                  <g
                    key={i}
                    style={{
                      translate: `calc(${x0}px - (var(--s1) + var(--s2) * 0.5) * ${Math.round(950 * speed)}px) ${y}px`,
                    }}
                  >
                    <line x1={size} y1="0" x2={size + 70 * speed} y2="0" className="st-trail" />
                    <Shape kind={kind} size={size} />
                  </g>
                ))}
              </g>
              <g style={{ opacity: 'var(--v2)' }}>
                <path
                  d="M400 220 Q 488 30 575 128"
                  pathLength={1}
                  className="st-dash st-dash-thin"
                  style={{ strokeDashoffset: 'calc(1 - var(--a2))' }}
                />
              </g>

              {/* 4 · Fail: a crooked screen falls apart */}
              <g style={{ opacity: 'var(--v3)' }}>
                <g className="pivot" style={{ rotate: 'calc(var(--a3) * -6deg)' }}>
                  <rect x="190" y="60" width="420" height="300" rx="24" className="st-ink screen" strokeWidth="5" style={{ strokeDasharray: 'none' }} />
                  {bars.map((w, i) => (
                    <rect
                      key={i}
                      x="248"
                      y={130 + i * 36}
                      width={w}
                      height="16"
                      rx="8"
                      className="fill-soft pivot"
                      style={{
                        translate: `0 calc(var(--a3) * ${150 + i * 34}px)`,
                        rotate: `calc(var(--a3) * ${i % 2 ? 22 : -16}deg)`,
                        opacity: 'calc(1 - var(--a3) * 0.7)',
                      }}
                    />
                  ))}
                  <path
                    d="M528 92 L506 150 L536 196 L510 262"
                    pathLength={1}
                    className="st-crack"
                    style={{ strokeDashoffset: 'calc(1 - var(--a3))' }}
                  />
                  <path
                    d="M352 132 L448 228 M448 132 L352 228"
                    pathLength={1}
                    className="st-x"
                    style={{ strokeDashoffset: 'calc(1 - clamp(0, calc(var(--a3) * 2 - 0.7), 1))' }}
                  />
                </g>
              </g>

              {/* 5 & 6 · Learn and Share: the screen, done right this time */}
              <g style={{ opacity: 'max(var(--v4), var(--v5))' }}>
                <rect
                  x="190"
                  y="60"
                  width="420"
                  height="310"
                  rx="24"
                  pathLength={1}
                  className="st-ink screen"
                  strokeWidth="5"
                  style={{ strokeDashoffset: 'calc(1 - min(1, var(--a4) * 1.6 + var(--a5)))' }}
                />
                <line x1="190" y1="104" x2="610" y2="104" className="st-soft" strokeWidth="3" />
                {[0, 1, 2].map((i) => (
                  <circle key={i} cx={218 + i * 20} cy="82" r="6" className="fill-soft" />
                ))}

                <g style={{ opacity: 'calc(1 - var(--a5) * 2)' }}>
                  {bars.map((w, i) => (
                    <rect
                      key={i}
                      x="248"
                      y={140 + i * 36}
                      width={w}
                      height="16"
                      rx="8"
                      className="fill-soft grow"
                      style={{ scale: `clamp(0, calc(var(--a4) * 3 - ${(0.5 + i * 0.35).toFixed(2)}), 1) 1` }}
                    />
                  ))}
                  <rect
                    x="248"
                    y="306"
                    width="132"
                    height="32"
                    rx="16"
                    className="fill-saffron grow"
                    style={{ scale: 'clamp(0, calc(var(--a4) * 3 - 2), 1) 1' }}
                  />
                  <path
                    d="M512 156 l24 24 l44 -48"
                    pathLength={1}
                    className="st-check"
                    style={{ strokeDashoffset: 'calc(1 - clamp(0, calc(var(--a4) * 3 - 2), 1))' }}
                  />
                </g>

                <g style={{ opacity: 'var(--a5)' }}>
                  {wave.map((h, i) => (
                    <rect
                      key={i}
                      x={250 + i * 17}
                      y={300 - h / 2}
                      width="7"
                      height={h}
                      rx="3.5"
                      className="fill-soft wave"
                      style={{ ['--w' as string]: i }}
                    />
                  ))}
                  <rect x="250" y="336" width="300" height="6" rx="3" className="fill-soft" />
                  <rect x="250" y="336" width="300" height="6" rx="3" className="fill-saffron grow" style={{ scale: 'var(--a5) 1' }} />
                  <circle cx="582" cy="82" r="7" className="fill-saffron blink" />
                </g>
              </g>

              {/* 6 & 7 · an audience gathers, then flies in to become the logo */}
              <g style={{ opacity: 'max(var(--v5), var(--v6))' }}>
                {crowd.map(([x, y], i) => {
                  const [tx, ty] = logoDots[i];
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="7"
                      className="fill-ink"
                      style={{
                        opacity: `calc(clamp(0, calc(var(--a5) * 3 - ${((i % 8) * 0.22).toFixed(2)}), 1) * (1 - clamp(0, calc(var(--a6) * 3 - 2), 1)))`,
                        translate: `calc(${(tx - x).toFixed(1)}px * var(--a6)) calc(${(ty - y).toFixed(1)}px * var(--a6))`,
                      }}
                    />
                  );
                })}
              </g>
              <g style={{ opacity: 'var(--v6)' }}>
                <path
                  d="M448.2 176.5 A72 72 0 1 0 448.2 283.5"
                  pathLength={1}
                  className="st-ink"
                  strokeWidth="25.7"
                  style={{ strokeDashoffset: 'calc(1 - clamp(0, calc(var(--a6) * 2.6 - 1.4), 1))' }}
                />
                <circle cx="400" cy="230" r="112" className="st-ripple beat" style={{ opacity: 'clamp(0, calc(var(--a6) * 3 - 2), 1)' }} />
              </g>

              {/* 8 · You: the path leads off screen, to the reader */}
              <g style={{ opacity: 'var(--v7)' }}>
                <path d="M340.1 205.4 A60 60 0 1 0 340.1 294.6" className="st-ink" strokeWidth="21" style={{ strokeDasharray: 'none', opacity: 0.9 }} />
                <path
                  d="M370 250 C 430 180, 500 320, 556 250"
                  pathLength={1}
                  className="st-dash"
                  style={{ strokeDashoffset: 'calc(1 - var(--a7))' }}
                />
                <g style={{ opacity: 'clamp(0, calc(var(--a7) * 2 - 1), 1)' }}>
                  <circle cx="588" cy="250" r="26" className="you-dot" />
                  <text x="588" y="306" textAnchor="middle" className="you-label">
                    you
                  </text>
                </g>
              </g>

              {/* The hero, on top of everything */}
              <g ref={heroRef} transform="translate(400 220) scale(0.01)">
                <circle ref={glowRef} r="3.4" fill="url(#story-glow)" />
                <circle r="1" className="fill-saffron" />
              </g>
              <path
                d="M388 192 L424 214 L388 236 Z"
                className="fill-coal"
                style={{ opacity: 'calc(var(--v5) * clamp(0, calc(var(--a5) * 2 - 0.6), 1))' }}
              />
            </g>
          </svg>
          </div>

          <ol className="story-captions m-0 list-none p-0">
            {scenes.map((scene, k) => (
              <li
                key={scene.chapter}
                className="story-caption"
                style={{ opacity: `var(--v${k})`, translate: `0 calc((1 - var(--v${k})) * 16px)` }}
              >
                {scene.caption}
              </li>
            ))}
          </ol>

          <div className="story-cta flex flex-wrap items-center justify-center gap-3">
            <Button href="/insights" size="lg">
              Start reading
            </Button>
            <Button href="/newsletter" variant="outline" size="lg">
              Get the newsletter
            </Button>
          </div>

          <nav aria-label="Story chapters" className="story-chapters">
            {scenes.map((scene, k) => (
              <button
                key={scene.chapter}
                type="button"
                onClick={() => jump(k)}
                aria-current={active === k ? 'step' : undefined}
                className={`story-chapter${active === k ? ' is-active' : ''}${active > k ? ' is-done' : ''}`}
              >
                <span className="story-chapter-bar" aria-hidden="true">
                  <span style={{ scale: `var(--a${k}) 1` }} />
                </span>
                {scene.chapter}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
