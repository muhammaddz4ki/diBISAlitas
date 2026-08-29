import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.1.46',
    '*.ngrok-free.dev',
    '*.ngrok-free.app',
    '*.ngrok.io',
    '*.ngrok.app',
  ],
  turbopack: {},
};

export default withSerwist(nextConfig);
