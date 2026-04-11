import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://grantedpath.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/settings/",
          "/ai-chat/",
          "/voice/",
          "/pronunciation/",
          "/ai-coach/",
          "/ai-planner/",
          "/ai-exam-predictor/",
          "/knowledge-map/",
          "/stats/",
          "/goals/",
          "/achievements/",
          "/certificates/",
          "/groups/",
          "/edu/",
          "/biz/",
          "/onboarding/",
          "/learn/",
          "/practice/",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ClaudeBot",
        disallow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
