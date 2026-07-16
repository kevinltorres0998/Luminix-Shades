import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Your Project | Luminix Shades",
  description: "Tell Luminix Shades about your space and receive a personalized recommendation for privacy, light control and architectural comfort.",
  openGraph: {
    title: "Plan Your Project | Luminix Shades",
    description: "Begin a personalized Luminix Shades project consultation.",
    url: "/plan-your-project",
    images: [{ url: "/images/plan-project-og.png", width: 1672, height: 941, alt: "Plan Your Project with Luminix Shades" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plan Your Project | Luminix Shades",
    description: "Begin a personalized Luminix Shades project consultation.",
    images: ["/images/plan-project-og.png"],
  },
};

export default function PlanProjectLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
