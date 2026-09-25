import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server hydrate when the page is opened via 127.0.0.1 (otherwise Next blocks its JS/HMR from that origin).
  allowedDevOrigins: ["127.0.0.1"],
  // Keep the dev-only "N" badge out of the way: the "back to the desk" keepsake is
  // top-left and little Peiwen stands bottom-right. Has no effect on production builds.
  devIndicators: { position: "bottom-left" },
};

export default nextConfig;
