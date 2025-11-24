/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.jp" },
      { protocol: "https", hostname: "images.microcms-assets.io" },
      {
        protocol: "https",
        hostname: "qssdaddcphdsbrujmbnh.supabase.co", // ← Supabaseのプロジェクトドメイン
        pathname: "/storage/v1/**", // ← Storageのパス
      },
    ],
  },
};

export default nextConfig;
