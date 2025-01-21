/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.artic.edu', 'upload.wikimedia.org', 'images.metmuseum.org'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
