/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'sharp', 'heic-convert'],
  },
  async redirects() {
    return [
      {
        source: '/painel',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/administrador',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/adm',
        destination: '/admin',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
