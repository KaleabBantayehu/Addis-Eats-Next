import { getDishes } from "./menu/getDishes"; // Ensure correct import path

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const dishes = await getDishes();

  const dishEntries = dishes.map((dish) => ({
    url: `${BASE_URL}/menu/${dish.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/menu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...dishEntries,
  ];
}