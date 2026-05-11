import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${SITE.url}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
