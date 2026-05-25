import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ronnixai.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/auth`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/tools/caption`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/reply`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/description`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/live`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/promo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/hashtags`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tools/reel`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tools/seasonal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tools/testimonial`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tools/variants`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tools/comparison`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
