import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: "/paper-review",
        assetPrefix: "/paper-review",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
