import type { NextConfig } from "next";
import path from "path";
const repoRoot = path.resolve(__dirname, "..");
const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  // @ts-expect-error eslint config
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
