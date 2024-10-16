/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "firebasestorage.googleapis.com",
            pathname: "**",
          },
          {
            protocol: "https",
            hostname: "assets.aceternity.com",
            pathname: "**",
          },
          {
            protocol: "https",
            hostname: "images.unsplash.com",
            pathname: "**",
          },
        ],
      },
};

export default nextConfig;
