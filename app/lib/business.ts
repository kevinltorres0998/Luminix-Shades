import { BOOKING_URL } from "./booking";

// Phone, street address, and public business hours are intentionally null until
// Luminix confirms them. Contact surfaces must never publish mockup sample data.
export const BUSINESS = {
  name: "Luminix Shades",
  email: "info@luminixshades.com",
  phone: null as string | null,
  address: null as string | null,
  mapsUrl: null as string | null,
  publicShowroom: false,
  bookingUrl: BOOKING_URL,
  hours: {
    weekdays: null as string | null,
    saturday: null as string | null,
    sunday: "By appointment only",
  },
  socialProfiles: {} as Record<string, string>,
  serviceAreas: [
    { name: "Palm Beach", x: 82, y: 11 },
    { name: "Boca Raton", x: 83, y: 31 },
    { name: "Fort Lauderdale", x: 82, y: 54 },
    { name: "Aventura", x: 81, y: 70 },
    { name: "Sunny Isles", x: 85, y: 73 },
    { name: "Miami Beach", x: 85, y: 83 },
    { name: "Miami", x: 74, y: 82 },
    { name: "Brickell", x: 77, y: 87 },
    { name: "Coral Gables", x: 67, y: 88 },
    { name: "Coconut Grove", x: 70, y: 92 },
    { name: "Key Biscayne", x: 83, y: 94 },
  ],
} as const;

