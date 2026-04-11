import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://grantedpath.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/mobile", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/beta", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/login", priority: 0.5, changeFrequency: "yearly" as const },
    { url: "/register", priority: 0.7, changeFrequency: "yearly" as const },
    { url: "/legal/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/legal/gdpr", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return staticRoutes.map(r => ({
    url: `${BASE_URL}${r.url}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
