import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Luminix Shades Administration",
    short_name: "Luminix Admin",
    description: "Luminix Shades private administration workspace.",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    background_color: "#141414",
    theme_color: "#141414",
    icons: [
      {
        src: "/images/luminix-full-logo-icon.png?v=7",
        sizes: "1536x1536",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
