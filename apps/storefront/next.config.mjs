/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  i18n: {
    locales: ['es-AR'],
    defaultLocale: 'es-AR'
  },
  transpilePackages: ['@ui', '@shared'],
  output: 'standalone'
};

export default nextConfig;


