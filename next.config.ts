import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Proxy API calls through the client's own domain so auth cookies are
  // first-party (fixes Google login `state_mismatch` across vercel.app/onrender.com).
  async rewrites() {
    const backend = (process.env.BACKEND_URL || "").replace(/\/+$/, "");
    if (!backend) return [];
    return [
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;