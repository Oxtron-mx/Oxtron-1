module.exports = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://oxtron-api-t5c24bp2fa-uc.a.run.app/:path',
      },
    ];
  },
};
