import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://zeform.zenstro.space";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms", "/auth/signin", "/f/*"],
        disallow: ["/dashboard", "/dashboard/*", "/api/*", "/builder/*"],
      },
      {
        userAgent: ["GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended"],
        allow: ["/", "/privacy", "/terms", "/llms.txt"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
