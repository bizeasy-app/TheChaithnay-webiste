import { externalUrl } from '@/lib/links';
import { site } from '@/lib/site';
import { InstagramGlyph, LinkedInGlyph, XGlyph, YouTubeGlyph } from '@/components/social/icons';

export type Social = { label: string; href: string; Icon: () => React.JSX.Element };

/** Only accounts that exist in lib/site.ts; add a URL there to add an icon. */
export const socials = [
  { label: 'LinkedIn', href: externalUrl(site.socials.linkedin), Icon: LinkedInGlyph },
  { label: 'X', href: externalUrl(site.socials.x), Icon: XGlyph },
  { label: 'Instagram', href: externalUrl(site.socials.instagram), Icon: InstagramGlyph },
  { label: 'YouTube', href: externalUrl(site.socials.youtube), Icon: YouTubeGlyph },
].filter((item): item is Social => Boolean(item.href));
