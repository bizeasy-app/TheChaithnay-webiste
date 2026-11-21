import { Bento } from '@/components/home/Bento';
import { JsonLd } from '@/components/seo/JsonLd';
import { BlogList } from '@/components/home/BlogList';
import { EndCTA } from '@/components/home/EndCTA';
import { Hero } from '@/components/home/Hero';
import { Pillars } from '@/components/home/Pillars';
import { Principles } from '@/components/home/Principles';
import { Story } from '@/components/home/Story';
import { TopicMarquee } from '@/components/home/TopicMarquee';
import { getLatestPosts } from '@/lib/posts';
import { homeJsonLd } from '@/lib/seo';

export default function HomePage() {
  const posts = getLatestPosts(3);

  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <div className="home-scroll" aria-hidden="true" />
      {/* The story, in order: the promise, why it exists, how I work,
          what you'll find, the proof, then an invitation. */}
      <Hero />
      <Story />
      <Principles />
      <Pillars />
      <TopicMarquee />
      <Bento />
      <BlogList posts={posts} />
      <EndCTA />
    </>
  );
}
