import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Addis Eats - Authentic Ethiopian Food & Local Delivery";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0F172A", // Deep sleek background
          backgroundImage:
            "radial-gradient(circle at 80% 20%, #1E293B 0%, #0F172A 70%)",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Top Header / Branding Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Logo Badge Icon */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#E11D48", // Primary Brand Accent
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            AE
          </div>
          <span
            style={{
              fontSize: "36px",
              fontWeight: "800",
              letterSpacing: "-0.02em",
              color: "#F8FAFC",
            }}
          >
            Addis Eats
          </span>
        </div>

        {/* Main Content / Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: "900",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
            }}
          >
            Discover & Order Authentic Ethiopian Cuisine
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#94A3B8",
              fontWeight: "400",
              lineHeight: 1.4,
            }}
          >
            From hot Doro Wat to freshly prepared Tibes and Firfir—delivered
            fast across Addis Ababa.
          </div>
        </div>

        {/* Footer Metrics / Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            borderTop: "1px solid #334155",
            paddingTop: "32px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "22px",
              color: "#CBD5E1",
              fontWeight: "600",
            }}
          >
            <span style={{ color: "#E11D48" }}>+</span> Real-Time Menu
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "22px",
              color: "#CBD5E1",
              fontWeight: "600",
            }}
          >
            <span style={{ color: "#E11D48" }}>+</span> Fast Local Delivery
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "22px",
              color: "#CBD5E1",
              fontWeight: "600",
            }}
          >
            <span style={{ color: "#E11D48" }}>4.9</span> Top Rated
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}