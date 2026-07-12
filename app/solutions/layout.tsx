import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Window Solutions | Luminix Shades",
  description: "Explore smart film, motorized shades, and custom drapery designed for exceptional residential and commercial spaces.",
};

export default function SolutionsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
