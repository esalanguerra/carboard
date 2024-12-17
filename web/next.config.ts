/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'images.nettiauto.com'
      }
    ],
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  transpilePackages: ['geist'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  }
};

module.exports = nextConfig;
