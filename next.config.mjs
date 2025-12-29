/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable TypeScript checks, disable ESLint due to config issues
  eslint: {
    ignoreDuringBuilds: true, // TODO: Fix ESLint config circular dependency issue
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Optimize images - set to true for production, false for static export
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
}

export default nextConfig
