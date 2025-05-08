import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['capmoo.s3.ap-southeast-1.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'capmoo.s3.ap-southeast-1.amazonaws.com',
        pathname: '/**',
      },
    ],
    // This tells Next.js to not try to optimize these images
    unoptimized: true,
  },
}

export default nextConfig

