// Debug endpoint to check environment variables (DO NOT USE IN PRODUCTION LONG-TERM)
export async function GET() {
  // Only show which variables exist, not their values
  const envCheck = {
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    MONGODB_URI: !!process.env.MONGODB_URI,
    ADMIN_USERNAME: !!process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    JWT_SECRET: !!process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  };

  return Response.json({
    message: "Environment Variables Check",
    variables: envCheck,
    allPresent: Object.values(envCheck).every(val => val === true || val === 'production'),
    timestamp: new Date().toISOString()
  });
}