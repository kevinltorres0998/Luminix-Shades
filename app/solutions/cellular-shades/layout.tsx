import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cellular Shades | Comfort, Engineered | Luminix Shades",
  description: "Premium cellular shades designed for insulation, quiet, privacy, and beautifully controlled light throughout South Florida.",
  openGraph: {
    title: "Comfort, engineered. | Luminix Shades",
    description: "Discover premium Cellular Shades designed around year-round comfort, quiet, and energy efficiency.",
    url: "https://luminix-shades.vercel.app/solutions/cellular-shades",
    siteName: "Luminix Shades",
    images: [{ url: "https://luminix-shades.vercel.app/images/cellular-og.png", width: 1672, height: 941, alt: "Luminix Shades — Comfort, engineered." }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comfort, engineered. | Luminix Shades",
    description: "Cellular Shades designed for year-round comfort, quiet, and privacy.",
    images: ["https://luminix-shades.vercel.app/images/cellular-og.png"],
  },
};

export default function CellularShadesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
