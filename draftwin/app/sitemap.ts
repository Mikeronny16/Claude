import { MetadataRoute } from "next";

const base = "https://claude-hsmg.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/affiliate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
