import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: '/month/:month',
      destination: '/',
      permanent: true,
    },
  ],
};

export default nextConfig;
