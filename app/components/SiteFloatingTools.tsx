"use client";

import { usePathname } from "next/navigation";
import ConsultationBooking from "./ConsultationBooking";
import WhatsAppButton from "./WhatsAppButton";
import AIConciergeLauncher from "./ai-concierge/AIConciergeLauncher";

export default function SiteFloatingTools() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <><ConsultationBooking /><AIConciergeLauncher /><WhatsAppButton /></>;
}
