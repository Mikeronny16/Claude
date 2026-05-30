import type { NextConfig } from "next";
import path from "path";
const repoRoot = path.resolve(__dirname, "..");
const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
