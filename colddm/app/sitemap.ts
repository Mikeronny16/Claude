import { MetadataRoute } from "next";

const base = "https://colddm.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/generator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];
}
