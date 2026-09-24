import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack ignores stray lockfiles elsewhere.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
