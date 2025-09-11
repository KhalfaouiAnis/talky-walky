import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/conversations",
        permanent: true,
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
