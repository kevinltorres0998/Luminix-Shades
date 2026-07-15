import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Selected Works by Luminix Shades",
  description: "Explore Luminix Shades residential and commercial design studies across South Florida, from Smart Film to custom drapery and motorized shades.",
};

export default function GalleryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
