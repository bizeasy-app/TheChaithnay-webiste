import Link from 'next/link';

const LOGO_WIDTH = 173;
const LOGO_HEIGHT = 32;

export function Logo() {
  return (
    <Link href="/" aria-label="The Chaithanya — home" className="inline-flex shrink-0 items-center">
      <img
        src="/brand/logo-horizontal-color-on-light.svg"
        alt=""
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="h-6 w-auto sm:h-8"
      />
    </Link>
  );
}
