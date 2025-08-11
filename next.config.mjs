/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to enable API routes
  // output: 'export', // Commented out to enable dynamic features

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Configure trailing slash for static hosting
  trailingSlash: true,

  // Disable server-side features for static export
  experimental: {
    // Remove optimizeFonts from experimental
  },

  // Configure asset prefix if needed
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/your-subdirectory' : '',
};

export default nextConfig;
