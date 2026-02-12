import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "gilang.bagian.web.id", // Daftarkan juga domain portofoliomu
      },
    ],
  },
};

export default nextConfig;
