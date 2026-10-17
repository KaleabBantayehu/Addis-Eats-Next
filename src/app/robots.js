import { getSiteUrl } from "@/lib/site-url";

// app/robots.js
export default function robots() {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/orders", "/kitchen", "/signin", "/signout", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}