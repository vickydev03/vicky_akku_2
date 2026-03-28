import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-8a5942cb01e54d70af415184ac8ed7b9.r2.dev",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
