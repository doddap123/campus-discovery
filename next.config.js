/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  webpack: config => {
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true }};
    return config;
  }
}

module.exports = nextConfig
