/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      // beforeFiles runs BEFORE Next.js file-system routing, so it takes
      // priority over app/prompts/page.tsx when ?r is absent.
      beforeFiles: [
        {
          source: '/prompts',
          missing: [{ type: 'query', key: 'r' }],
          destination: '/prompts/111_originale_venta.html',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
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
