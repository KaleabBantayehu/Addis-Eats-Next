import { ImageResponse } from "next/og";
import { dishes } from "../dishes";

export const alt = "Dish Preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { id } = await params;
  const dish = dishes.find((item) => String(item.id) === String(id));

  const dishName = dish?.name || "Addis Eats";
  const dishCategory = dish?.category ? dish.category.toUpperCase() : "MENU DLOG";
  const dishPrice = dish?.price ? `${dish.price} ETB` : "";
  const dishDescription = dish?.description || "Authentic Ethiopian food delivered to your door.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: "#1c1917",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background Decorative Accent */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            backgroundColor: "rgba(234, 88, 12, 0.15)",
            display: "flex",
          }}
        />

        {/* Header Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "32px",
              fontWeight: "bold",
              color: "#ea580c",
              letterSpacing: "2px",
            }}
          >
            ADDIS EATS
          </div>

          {dishCategory ? (
            <div
              style={{
                display: "flex",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#fed7aa",
                backgroundColor: "rgba(234, 88, 12, 0.2)",
                padding: "8px 20px",
                borderRadius: "9999px",
                letterSpacing: "1px",
              }}
            >
              {dishCategory}
            </div>
          ) : null}
        </div>

        {/* Main Content Body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "950px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "64px",
              fontWeight: "bold",
              lineHeight: 1.1,
              color: "#ffffff",
            }}
          >
            {dishName}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "26px",
              color: "#a8a29e",
              lineHeight: 1.4,
            }}
          >
            {dishDescription}
          </div>
        </div>

        {/* Footer / Price Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #292524",
            paddingTop: "32px",
            width: "100%",
          }}
        >
          {dishPrice ? (
            <div
              style={{
                display: "flex",
                fontSize: "48px",
                fontWeight: "bold",
                color: "#f97316",
              }}
            >
              {dishPrice}
            </div>
          ) : (
            <div style={{ display: "flex" }} />
          )}

          <div
            style={{
              display: "flex",
              fontSize: "20px",
              color: "#78716c",
            }}
          >
            addiseats.et
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}