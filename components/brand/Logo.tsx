import Link from 'next/link';

const LOGO_WIDTH = 173;
const LOGO_HEIGHT = 32;

/** Both colourways are in the markup; the theme decides which one shows (no flash). */
export function Logo() {
  return (
    <Link href="/" aria-label="The Chaithanya — home" className="inline-flex shrink-0 items-center">
      <img
        src="/brand/logo-horizontal-color-on-light.svg"
        alt=""
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="theme-light-only h-6 w-auto sm:h-8"
      />
      <img
        src="/brand/logo-horizontal-color-on-dark.svg"
        alt=""
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="theme-dark-only h-6 w-auto sm:h-8"
      />
    </Link>
  );
}
