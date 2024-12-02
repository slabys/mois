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
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_APP1_URL: process.env.NEXT_PUBLIC_APP1_URL,
    PORT_FE: process.env.PORT_FE,
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "@mantine/dates"],
  },
};

export default withPWA(nextConfig);
