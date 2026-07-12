import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motorized Roller Shades | Luminix Shades",
  description: "Custom motorized roller shades for precise light control, comfort, privacy, and refined interiors across South Florida.",
};

export default function RollerShadesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
