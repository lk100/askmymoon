/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.3'],
  images: {
    unoptimized: true // avoids image optimization issues on static hosting
  }
};

export default nextConfig;
