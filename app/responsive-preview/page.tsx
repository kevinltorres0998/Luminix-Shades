import { notFound } from "next/navigation";

import ResponsivePreviewWall from "./ResponsivePreviewWall";

export const metadata = {
  title: "Responsive Preview Wall",
  robots: { index: false, follow: false },
};

export default function ResponsivePreviewPage() {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment) {
    notFound();
  }

  return <ResponsivePreviewWall />;
}
