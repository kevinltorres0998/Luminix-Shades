import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Luminix Shades | Designed Around Light",
  description: "Discover the design philosophy, craftsmanship, and technology behind Luminix Shades in South Florida.",
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
