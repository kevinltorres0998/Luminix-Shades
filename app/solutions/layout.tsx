import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Window Solutions | Luminix Shades",
  description: "Explore Smart Film, Motorized Roller Shades, Custom Drapery, and Cellular Shades designed for exceptional residential and commercial spaces.",
};

export default function SolutionsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
