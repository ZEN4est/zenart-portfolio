import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/test',
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;