/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ['@ui', '@shared'],
  output: 'standalone'
};

export default nextConfig;


