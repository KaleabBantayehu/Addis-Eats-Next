import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Addis Eats - Full Food Menu & Online Ordering";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function MenuOGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0F172A", // Slate dark background
          backgroundImage:
            "radial-gradient(circle at 85% 15%, #1E293B 0%, #0F172A 70%)",
          padding: "70px 80px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Top Bar: Brand & Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "14px",
                backgroundColor: "#E11D48",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
              }}
            >
              🇪🇹
            </div>
            <span
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#F8FAFC",
                letterSpacing: "-0.02em",
              }}
            >
              Addis Eats
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#1E293B",
              border: "1px solid #334155",
              borderRadius: "30px",
              padding: "10px 22px",
              fontSize: "18px",
              color: "#38BDF8",
              fontWeight: "600",
            }}
          >
            Live Menu & Prices
          </div>
        </div>

        {/* Center: Main Title & Category Chips */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "58px",
              fontWeight: "900",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
            }}
          >
            Explore Our Full Menu
          </div>

          <div
            style={{
              fontSize: "24px",
              color: "#94A3B8",
              fontWeight: "400",
            }}
          >
            Freshly prepared traditional dishes, gourmet burgers, pizzas & daily specials.
          </div>

          {/* Featured Menu Category Badges */}
          <div style={{ display: "flex", gap: "14px", marginTop: "8px" }}>
            {["🔥 Kitfo", "🍗 Doro Wat", "🍕 Gourmet Pizza", "🥩 Tibs & Firfir"].map(
              (category) => (
                <div
                  key={category}
                  style={{
                    backgroundColor: "#1E293B",
                    border: "1px solid #475569",
                    borderRadius: "12px",
                    padding: "10px 18px",
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#E2E8F0",
                  }}
                >
                  {category}
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer: Ordering Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #334155",
            paddingTop: "28px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "32px", fontSize: "20px", color: "#CBD5E1" }}>
            <span>⚡ Fast Local Delivery</span>
            <span>•</span>
            <span>💳 Easy Checkout</span>
            <span>•</span>
            <span>📍 Addis Ababa</span>
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#E11D48",
            }}
          >
            addiseats.et/menu
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}