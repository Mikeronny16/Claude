import { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://whispr-shh.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/join`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/leaderboard`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/inbox`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
  ];
}
