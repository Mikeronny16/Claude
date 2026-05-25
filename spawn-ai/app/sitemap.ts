import { MetadataRoute } from "next";

const base = "https://spawn-ai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/auth/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/auth/signin`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
