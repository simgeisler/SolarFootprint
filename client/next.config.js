/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Docker + FastAPI tek serviste statik dosya olarak sunmak için
  output: "export",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
