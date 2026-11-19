import { Bento } from '@/components/home/Bento';
import { JsonLd } from '@/components/seo/JsonLd';
import { BlogList } from '@/components/home/BlogList';
import { EndCTA } from '@/components/home/EndCTA';
import { Hero } from '@/components/home/Hero';
import { TopicMarquee } from '@/components/home/TopicMarquee';
import { getLatestPosts } from '@/lib/posts';
import { homeJsonLd } from '@/lib/seo';

export default function HomePage() {
  const posts = getLatestPosts(3);

  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <div className="home-scroll" aria-hidden="true" />
      <Hero />
      <TopicMarquee />
      <Bento />
      <BlogList posts={posts} />
      <EndCTA />
    </>
  );
}
