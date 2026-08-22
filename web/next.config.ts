import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.46', 'localhost', '127.0.0.1'],
  turbopack: {},
};

export default withSerwist(nextConfig);
