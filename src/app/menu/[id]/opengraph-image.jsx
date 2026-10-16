// app/menu/[id]/opengraph-image.jsx
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getDishes } from "../getDishes";

export const alt = "Dish Preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { id } = await params;
  const dishes = await getDishes();
  const dish = dishes.find((item) => String(item.id) === id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          fontFamily: "sans-serif",
          background: "#292524",
          position: "relative",
        }}
      >
        {dish && (
          <img
            src={`${siteUrl}${dish.image}`}
            alt=""
            width="1200"
            height="630"
            style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <div style={{
        display: "flex",
        flexDirection: "column",
          gap: 12,
          width: "100%",
          padding: 64,
          color: "#fff",
          background: "linear-gradient(transparent, rgba(0, 0, 0, 0.86))",
        }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: "bold", color: "#fed7aa" }}>ADDIS EATS</div>
          <div style={{ display: "flex", fontSize: 60, fontWeight: "bold" }}>{dish?.name || "Addis Eats"}</div>
          {dish && <div style={{ display: "flex", fontSize: 36, color: "#ffedd5" }}>{dish.price} ETB</div>}
        </div>
      </div>
    ),
    { ...size }
  );
}