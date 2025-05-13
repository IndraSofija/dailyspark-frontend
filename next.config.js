/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://dailysparkclean-production-74eb.up.railway.app;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
