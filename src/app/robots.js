// app/robots.js
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/orders", "/kitchen", "/signin", "/signout", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}