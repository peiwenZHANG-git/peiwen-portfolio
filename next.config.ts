import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server hydrate when the page is opened via 127.0.0.1 (otherwise Next blocks its JS/HMR from that origin).
  allowedDevOrigins: ["127.0.0.1"],
  // Keep the dev-only "N" badge out of the bottom-left corner, where every inner page
  // has its "back to the desk" keepsake. Has no effect on production builds.
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
