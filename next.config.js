/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

module.exports = nextConfig;
