const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1",
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || "v1",
  },
  webpack: (config) => {
    // 🔹 Alias for @/ to point to src/
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;
