import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: false,
  // Dev and production builds must not share a cache. A production build
  // overwrites .next while `next dev` is running and breaks the Webpack runtime.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
