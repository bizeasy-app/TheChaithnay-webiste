/**
 * Projects shown on /projects, in this order.
 * While this list is empty the page shows the "In the lab" coming-soon cards.
 *
 * image: optional path under /public (e.g. '/projects/xtrackr.webp'), ~1200×750.
 * tone:  card colour when there is no image.
 */
export type ProjectStatus = 'live' | 'building' | 'idea';

export type Project = {
  name: string;
  /** One line, shown when the card is hovered. */
  oneLiner: string;
  status: ProjectStatus;
  url?: string;
  year?: string;
  tags?: string[];
  image?: string;
  tone?: 'ink' | 'indigo' | 'saffron' | 'white';
};

export const projects: Project[] = [];
