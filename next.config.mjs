/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to enable API routes
  // output: 'export', // Commented out to enable dynamic features

  // Image configuration
  images: {
    unoptimized: true, // Keep this for static export
    // If you want to use Next.js Image optimization with Cloudinary, uncomment below:
    // domains: ['res.cloudinary.com'],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'res.cloudinary.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
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
