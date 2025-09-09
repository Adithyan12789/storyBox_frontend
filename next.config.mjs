/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  devIndicators: {
    buildActivity: false,
  },
  images: {
    domains: [''], // Add the hostname here
  },
  webpack(config) {
    config.optimization.minimize = true; // Temporarily disable CSS minification
    return config;
  },
};

export default nextConfig;
