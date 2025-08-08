import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  scope: "/",
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    PORT_FE: process.env.PORT_FE,
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "@mantine/dates"],
  },
};

export default withPWA(nextConfig);
