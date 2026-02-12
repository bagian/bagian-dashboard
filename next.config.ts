import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Nonaktifkan LightningCSS agar CSS hanya lewat PostCSS (plugin kita ganti color() → hex)
    useLightningcss: false,
  },
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
