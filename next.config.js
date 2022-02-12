/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
      {
        source: '/work',
        destination: '/projects',
        // Not totally sure that we want this to be permanent - maybe we want to have something else at /work in the future?
        permanent: false,
      },
    ];
  },
};
