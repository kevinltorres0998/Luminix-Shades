import NextImage from "next/image";
import Link from "next/link";
import { BOOKING_URL } from "../lib/booking";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/LuminixShades", icon: <path d="M13.5 8.4h2.2V5.2c-.4-.1-1.7-.2-3.1-.2-3.1 0-5.2 1.9-5.2 5.4v3H4v3.6h3.4v9h4.2v-9h3.3l.5-3.6h-3.8v-2.7c0-1.1.3-2.3 1.9-2.3Z" /> },
  { label: "Instagram", href: "https://www.instagram.com/luminixshades/", icon: <><rect x="4.5" y="4.5" width="21" height="21" rx="6" /><circle cx="15" cy="15" r="5" /><circle cx="22" cy="8" r="1" className="social-fill" /></> },
  { label: "TikTok", href: "https://www.tiktok.com/@luminixshades", icon: <path d="M18.3 4.5c.5 3 2.2 4.8 5.2 5.3v4a11 11 0 0 1-5.2-1.5v7.2a7.5 7.5 0 1 1-6.5-7.4v4.1a3.5 3.5 0 1 0 2.5 3.3v-15h4Z" /> },
  { label: "YouTube", href: "https://www.youtube.com/@LuminixShades", icon: <><path d="M26 9.1a3.5 3.5 0 0 0-2.5-2.5C21.3 6 15 6 15 6s-6.3 0-8.5.6A3.5 3.5 0 0 0 4 9.1 36 36 0 0 0 3.5 15 36 36 0 0 0 4 20.9a3.5 3.5 0 0 0 2.5 2.5c2.2.6 8.5.6 8.5.6s6.3 0 8.5-.6a3.5 3.5 0 0 0 2.5-2.5c.5-2 .5-5.9.5-5.9s0-3.9-.5-5.9Z" /><path d="m12.5 19 6.5-4-6.5-4v8Z" className="social-play" /></> },
];

export default function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand"><Link className="brand" href="/" aria-label="Luminix Shades home"><NextImage className="official-logo" src="/images/logo-white.png" alt="" width={2420} height={689} unoptimized /></Link><p>Smart film. Motorized shades.<br />Custom drapery. Designed for living.</p></div>
      <div><b>SOLUTIONS</b><a href="/solutions/smart-film">Smart Film</a><a href="/solutions/roller-shades">Motorized Shades</a><a href="/solutions/custom-drapery">Custom Drapery</a><a href="/solutions/cellular-shades">Cellular Shades</a></div>
      <div><b>COMPANY</b><a href="/residential">Residential</a><a href="/commercial">Commercial</a><a href="/gallery">Gallery</a><a href="/about">About Us</a><a href="/contact">Contact</a></div>
      <div id="faq"><b>RESOURCES</b><Link href="/private-list">The Private List</Link><Link href="/#faq">FAQ</Link><Link href="/plan-your-project">Get a Quote</Link><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Schedule a Consultation</a><Link href="/privacy-policy">Privacy Policy</Link></div>
      <div><b>FOLLOW US</b><nav className="social-links" aria-label="Luminix Shades social media">{socialLinks.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`${social.label} — Luminix Shades`} title={social.label}><svg viewBox="0 0 30 30" aria-hidden="true">{social.icon}</svg></a>)}</nav><p>© 2026 Luminix Shades<br />All rights reserved.</p></div>
    </footer>
  );
}
