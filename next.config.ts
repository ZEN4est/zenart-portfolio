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
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
