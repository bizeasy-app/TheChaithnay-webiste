import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Manrope } from 'next/font/google';
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

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
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
