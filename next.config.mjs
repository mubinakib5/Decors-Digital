/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for cPanel hosting
  output: 'export',
  
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
  
  // Ensure all pages are statically generated
  generateStaticParams: async () => {
    return [];
  },
};

export default nextConfig;
