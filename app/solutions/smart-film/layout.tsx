import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Film | Switchable Privacy Glass | Luminix Shades",
  description: "Transform glass from clear to private on demand with architectural smart film for refined residential and commercial spaces in South Florida.",
};

export default function SmartFilmLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
