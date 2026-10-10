import "./globals.css";
import { inter } from "./ui/fonts";
import Navbar from "./Navbar";
import { getSession } from "@/lib/session";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  title: {
    default: "Addis Eats · Ethiopian food delivery",
    template: "%s · Addis Eats",
  },
  description:
    "Order authentic Ethiopian dishes, freshly prepared and delivered across Addis Ababa.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Addis Eats",
    description:
      "Order authentic Ethiopian dishes, freshly prepared and delivered across Addis Ababa.",
    type: "website",
    locale: "en_ET",
    siteName: "Addis Eats",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Addis Eats Ethiopian food delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Addis Eats",
    description:
      "Order authentic Ethiopian food for delivery across Addis Ababa.",
    images: ["/opengraph-image"],
  },
};

export default async function RootLayout({ children }) {
  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Addis Eats",
    image: `${siteUrl}/opengraph-image`,
    url: siteUrl,
    priceRange: "$$",
    servesCuisine: ["Ethiopian", "International"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Addis Ababa",
      addressCountry: "ET",
    },
    currenciesAccepted: "ETB",
    paymentAccepted: "Cash, Telebirr",
  };
  const session = await getSession();
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-orange-50 text-gray-900`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(restaurantJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <div className="flex min-h-screen flex-col">
          {/* Client-side Navbar Component */}
          <Navbar session={session}/>

          {/* pt-20 prevents page content from hiding behind fixed header */}
          <div className="flex-1 bg-[#fdfbf7] pt-20">
            {children}
          </div>

          <footer className="mt-auto border-t border-orange-100 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-700">
              © 2026 Addis Eats. Ethiopian food delivered with care.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}