/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ✅ Skip type checking on Vercel build
    ignoreBuildErrors: true
  },
  eslint: {
    // ✅ Skip ESLint checks on Vercel build
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
