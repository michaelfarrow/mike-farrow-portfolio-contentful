/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    appDir: true,
    scrollRestoration: true,
  },
}

module.exports = nextConfig
