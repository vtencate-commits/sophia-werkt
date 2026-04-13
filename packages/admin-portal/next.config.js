/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sophia-werkt/ui', '@sophia-werkt/shared'],
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
