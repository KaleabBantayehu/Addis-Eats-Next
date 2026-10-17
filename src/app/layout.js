import "./globals.css";
import { manrope } from "./ui/fonts";
import Navbar from "./Navbar";
import MobileNavigation from "./MobileNavigation";
import { getSession } from "@/lib/session";

const siteUrl = "https://addis-eats-next-psi.vercel.app";
const defaultFoodImage = "/images/hero.png";

export const metadata = {
  title: {
    default: "Addis Eats · Ethiopian food delivery",
    template: "%s · Addis Eats",
  },
  description:
    "Order authentic Ethiopian dishes, freshly prepared and delivered across Addis Ababa.",
  metadataBase: new URL("https://addis-eats-next-psi.vercel.app"),
  openGraph: {
    title: "Addis Eats",
    description:
      "Order authentic Ethiopian dishes, freshly prepared and delivered across Addis Ababa.",
    type: "website",
    locale: "en_ET",
    siteName: "Addis Eats",
    images: [
      {
        url: defaultFoodImage,
        alt: "Addis Eats Ethiopian food delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Addis Eats",
    description:
      "Order authentic Ethiopian food for delivery across Addis Ababa.",
    images: [defaultFoodImage],
  },
};

export default async function RootLayout({ children }) {
  const session = await getSession();
  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Addis Eats",
    image: new URL(defaultFoodImage, siteUrl).toString(),
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

  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(restaurantJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <div className="flex min-h-screen flex-col">
          {/* Client-side Navbar Component */}
          <Navbar session={session} />

          {/* pt-20 prevents page content from hiding behind fixed header */}
          <div className="flex-1 bg-background pt-20 pb-20 lg:pb-0">
            {children}
          </div>

          <footer className="mt-auto border-t border-border bg-surface-warm">
            <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-foreground-muted">
              © 2026 Addis Eats. Ethiopian food delivered with care.
            </div>
          </footer>
          <MobileNavigation session={session} />
        </div>
      </body>
    </html>
  );
}
