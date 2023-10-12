/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
  output: "standalone",
};

module.exports = nextConfig;
