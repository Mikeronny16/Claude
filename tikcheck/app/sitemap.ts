import { MetadataRoute } from "next";

const base = "https://tikcheck.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/hook`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/caption`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/hashtags`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/timing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/score`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/calendar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/image`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
