import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/test',
  allowedDevOrigins: [
    '192.168.1.223',
    '192.168.1.223:3000',
    'localhost',
    'localhost:3000',
    '*.local',
  ],
};

export default nextConfig;
