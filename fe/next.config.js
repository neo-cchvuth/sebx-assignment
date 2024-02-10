/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['avataaars.io'],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
