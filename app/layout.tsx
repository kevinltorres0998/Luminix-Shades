import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luminix Shades | Premium Window Solutions Miami",
  description: "Smart film, motorized shades and custom drapery for exceptional residential and commercial spaces across South Florida.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
