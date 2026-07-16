import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // The private admin is hosted on Cloudflare/Sites. The public Vercel build
  // must be able to compile the shared app without evaluating that native API.
  ...(process.env.VERCEL ? {
    turbopack: {
      resolveAlias: { "cloudflare:workers": "./app/lib/cloudflare-workers-shim.ts" },
    },
  } : {}),
};

export default nextConfig;
