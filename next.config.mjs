/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["storage.apex4u.com", "ibb.com", "i.ibb.com", "i.ibb.co.com"],
  },
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
