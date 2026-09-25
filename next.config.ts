import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server hydrate when the page is opened via 127.0.0.1 (otherwise Next blocks its JS/HMR from that origin).
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
