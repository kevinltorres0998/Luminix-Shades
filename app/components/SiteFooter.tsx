import NextImage from "next/image";
import { BOOKING_URL } from "../lib/booking";

export default function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand"><a className="brand" href="/" aria-label="Luminix Shades home"><NextImage className="official-logo" src="/images/logo-white.png" alt="" width={2420} height={689} unoptimized /></a><p>Smart film. Motorized shades.<br />Custom drapery. Designed for living.</p></div>
      <div><b>SOLUTIONS</b><a href="/solutions/smart-film">Smart Film</a><a href="/solutions/roller-shades">Motorized Shades</a><a href="/solutions/custom-drapery">Custom Drapery</a><a href="/solutions/cellular-shades">Cellular Shades</a></div>
      <div><b>COMPANY</b><a href="/residential">Residential</a><a href="/commercial">Commercial</a><a href="/gallery">Gallery</a><a href="/about">About Us</a><a href="/#contact">Contact</a></div>
      <div id="faq"><b>RESOURCES</b><a href="/#faq">FAQ</a><a href="/#contact">Get a Quote</a><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Schedule a Consultation</a><a href="/#top">Privacy Policy</a></div>
      <div><b>FOLLOW US</b><p>◎ &nbsp; f &nbsp; in</p><p>© 2026 Luminix Shades<br />All rights reserved.</p></div>
    </footer>
  );
}
