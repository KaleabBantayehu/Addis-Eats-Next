import { getDishes } from "./menu/getDishes";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap() {
  const baseUrl = getSiteUrl();
  const dishes = await getDishes();

  const dishEntries = dishes.map((dish) => ({
    url: `${baseUrl}/menu/${dish.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...dishEntries,
  ];
}
