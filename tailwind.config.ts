import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cloud: 'var(--cloud)',
        ink: 'var(--ink)',
        saffron: 'var(--saffron)',
        indigo: 'var(--indigo)',
        muted: 'var(--muted)',
        'muted-dark': 'var(--muted-dark)',
        body: 'var(--body)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        'ink-2': 'var(--ink-2)',
        'ink-input': 'var(--ink-input)',
        'on-indigo': 'var(--on-indigo)',
        'on-indigo-soft': 'var(--on-indigo-soft)',
        placeholder: 'var(--placeholder)',
        white: 'var(--white)',
        'ink-3': 'var(--ink-3)',
        'on-ink-soft': 'var(--on-ink-soft)',
        paper: 'var(--paper)',
        coal: 'var(--coal)',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        page: '1240px',
      },
      keyframes: {
        blink: {
          '0%, 45%': { opacity: '1' },
          '50%, 95%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        blink: 'blink 1.2s steps(1) infinite',
        marquee: 'marquee 32s linear infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
      },
      boxShadow: {
        lift: '0 18px 40px rgba(26,23,20,.12)',
        float: '0 16px 40px rgba(26,23,20,.18)',
      },
    },
  },
  plugins: [],
};

export default config;
