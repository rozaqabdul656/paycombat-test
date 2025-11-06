import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  /* config options here */
  ignoreDuringBuilds: isVercel,
};

export default nextConfig;
