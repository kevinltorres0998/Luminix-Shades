import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Drapery | Luminix Shades",
  description: "Luxury custom drapery, tailored fabrics, refined pleats, and architectural hardware for exceptional South Florida interiors.",
};

export default function CustomDraperyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
