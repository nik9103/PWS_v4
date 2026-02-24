import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include globals.css in the production bundle so the font-parser
  // utility (src/lib/get-css-fonts.ts) can read it at runtime on Vercel.
  outputFileTracingIncludes: {
    "/": ["./src/app/globals.css"],
  },
};

export default nextConfig;
