/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,

  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "@mantine/dates"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:4000/:path*", // Proxy to the backend
      },
    ];
  },
};

export default nextConfig;
