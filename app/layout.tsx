import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luminix Shades | Premium Window Solutions Miami",
  description: "Smart film, motorized shades and custom drapery for exceptional residential and commercial spaces across South Florida.",
  metadataBase: new URL("https://luminix-shades.vercel.app"),
  openGraph: {
    title: "Luminix Shades | Designed around the way you live.",
    description: "Premium window solutions for privacy, light control, comfort, and architectural design.",
    url: "/",
    siteName: "Luminix Shades",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "Luminix Shades window solutions showroom" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luminix Shades | Designed around the way you live.",
    description: "Explore premium window solutions for privacy, light control, comfort, and design.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
