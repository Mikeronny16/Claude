import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://toynar.vercel.app", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ];
}
