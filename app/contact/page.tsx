import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ContactSection } from '@/components/newsletter/ContactSection';
import { PageHero } from '@/components/page/PageHero';
import { contactJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact | The Chaithanya',
  description: 'Partnerships, collaborations, interviews or an experiment you want me to try. Write to Chaithanya. Every message is read.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactJsonLd()} />
      <PageHero
        id="contact-h"
        label="Contact"
        lines={["Let's build", 'something']}
        intro="Partnerships, collaborations, interviews, or an experiment you want me to try. Pick a reason, say what you need. I read every message."
      />
      <ContactSection />
    </>
  );
}
