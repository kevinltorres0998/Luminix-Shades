import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Luminix Shades | South Florida Window Solutions",
  description: "Contact Luminix Shades for Smart Film, motorized roller shades, custom drapery and personalized window-treatment consultations throughout South Florida.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Luminix Shades",
    description: "Connect with Luminix Shades for premium window solutions throughout South Florida.",
    url: "/contact",
    images: [{ url: "/images/solutions-showroom-hero-v2.webp" }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) { return children; }

