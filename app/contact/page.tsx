import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ContactSection } from '@/components/newsletter/ContactSection';
import { PageHero } from '@/components/page/PageHero';
import { contactJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact | The Chaithanya',
  description: 'Professional inquiries, partnerships and collaborations. Write to Chaithanya — every message is read.',
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
        intro="Professional inquiries, partnerships and collaborations — or just an idea worth testing. Pick a reason below and say what you need."
      />
      <ContactSection />
    </>
  );
}
