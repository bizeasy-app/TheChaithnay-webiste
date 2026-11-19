import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { AskMe } from '@/components/askme/AskMe';
import { Footer } from '@/components/layout/Footer';
import { Nav } from '@/components/layout/Nav';
import { SkipLink } from '@/components/layout/SkipLink';
import { HashScroll } from '@/components/motion/HashScroll';
import { PageIntro } from '@/components/motion/PageIntro';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { Analytics } from '@/components/seo/Analytics';
import { homeTitle, pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';
import 'lenis/dist/lenis.css';
import './globals.css';

const manrope = localFont({
  src: [
    { path: './fonts/manrope-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/manrope-600.woff2', weight: '600', style: 'normal' },
    { path: './fonts/manrope-700.woff2', weight: '700', style: 'normal' },
    { path: './fonts/manrope-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-manrope',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: [{ path: './fonts/jetbrains-mono-500.woff2', weight: '500', style: 'normal' }],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  ...pageMetadata({
    title: homeTitle,
    description: site.description,
    path: '/',
  }),
  metadataBase: new URL(site.url),
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#F0EEE9',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="overflow-x-hidden bg-cloud font-sans text-ink antialiased">
        <SmoothScroll />
        <HashScroll />
        <PageIntro />
        <SkipLink />
        <Nav />
        <div id="content" tabIndex={-1} className="outline-none">
          {children}
        </div>
        <Footer />
        <AskMe />
        <Analytics />
      </body>
    </html>
  );
}
