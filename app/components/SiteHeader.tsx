"use client";

import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BOOKING_URL } from "../lib/booking";

export default function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const isCurrent = (href: string) => pathname === href;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSolutionsOpen(false);
        setMobileOpen(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const menuTrigger = menuButtonRef.current;
    const panel = mobilePanelRef.current;
    const focusable = panel ? Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')) : [];
    document.body.style.overflow = "hidden";
    focusable[0]?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = previousOverflow;
      (previouslyFocused ?? menuTrigger)?.focus();
    };
  }, [mobileOpen]);

  const closeNavigation = () => {
    setSolutionsOpen(false);
    setMobileOpen(false);
    setMobileSolutionsOpen(false);
  };

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${mobileOpen ? " is-mobile-open" : ""}`}>
      <div className="main-nav">
        <a className="brand" href={onHome ? "#top" : "/"} aria-label="Luminix Shades home" onClick={closeNavigation}>
          <NextImage className="official-logo" src="/images/logo-white.png" alt="" width={2420} height={689} priority unoptimized />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a className={onHome ? "active" : ""} href={onHome ? "#top" : "/"}>Home</a>
          <div
            className={`solutions-nav${solutionsOpen ? " is-open" : ""}`}
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) setSolutionsOpen(false);
            }}
          >
            <a className={`nav-trigger${pathname === "/solutions" || pathname === "/residential" || pathname === "/commercial" ? " active" : ""}`} href="/solutions" aria-expanded={solutionsOpen} aria-controls="solutions-mega-menu" onFocus={() => setSolutionsOpen(true)}>
              Solutions <span aria-hidden="true">⌄</span>
            </a>
            <div className="mega-menu" id="solutions-mega-menu">
              <div className="mega-products">
                <a href="/solutions/smart-film" onClick={closeNavigation}>
                  <span className="mega-detail film-detail" aria-hidden="true" /><h3>Smart Film</h3>
                  <p>Switchable privacy glass for residential and commercial spaces.</p>
                </a>
                <a href="/solutions/roller-shades" onClick={closeNavigation}>
                  <span className="mega-detail shade-detail" aria-hidden="true" /><h3>Motorized Shades</h3>
                  <p>Automated window treatments designed for comfort, privacy, and light control.</p>
                </a>
                <a href="/solutions/custom-drapery" onClick={closeNavigation}>
                  <span className="mega-detail drapery-detail" aria-hidden="true" /><h3>Custom Drapery</h3>
                  <p>Tailored designer drapery with premium fabrics and refined finishes.</p>
                </a>
                <a href="/solutions/cellular-shades" onClick={closeNavigation}>
                  <span className="mega-detail cellular-detail" aria-hidden="true" /><h3>Cellular Shades</h3>
                  <p>Insulating honeycomb shades designed for comfort, quiet, and energy efficiency.</p>
                </a>
              </div>
              <div className="mega-secondary">
                <a href="/residential" onClick={closeNavigation}>Residential <span aria-hidden="true">→</span></a>
                <a href="/commercial" onClick={closeNavigation}>Commercial <span aria-hidden="true">→</span></a>
              </div>
            </div>
          </div>
          <a className={pathname === "/gallery" ? "active" : ""} href="/gallery">Gallery</a>
          <a className={pathname === "/about" ? "active" : ""} href="/about">About</a>
          <a className={pathname === "/contact" ? "active" : ""} href="/contact">Contact</a>
        </nav>

        <a className="button button-gold desktop-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">SCHEDULE A CONSULTATION</a>
        <button ref={menuButtonRef} className={`mobile-menu${mobileOpen ? " is-open" : ""}`} type="button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="mobile-navigation-panel" onClick={() => setMobileOpen((open) => !open)}>
          <span /><span /><span />
        </button>
      </div>

      {mobileOpen && (
        <div ref={mobilePanelRef} className="mobile-panel" id="mobile-navigation-panel" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <nav aria-label="Mobile navigation">
            <a className={onHome ? "active" : ""} aria-current={onHome ? "page" : undefined} href={onHome ? "#top" : "/"} onClick={closeNavigation}>Home</a>
            <div className="mobile-solutions-row">
              <a className={pathname.startsWith("/solutions") ? "active" : ""} aria-current={isCurrent("/solutions") ? "page" : undefined} href="/solutions" onClick={closeNavigation}>Solutions</a>
              <button className="mobile-solutions-toggle" type="button" aria-label={mobileSolutionsOpen ? "Collapse solutions" : "Expand solutions"} aria-expanded={mobileSolutionsOpen} onClick={() => setMobileSolutionsOpen((open) => !open)}>
                <span aria-hidden="true">{mobileSolutionsOpen ? "−" : "+"}</span>
              </button>
            </div>
            {mobileSolutionsOpen && (
              <div className="mobile-solutions">
                <a className={isCurrent("/solutions/smart-film") ? "active" : ""} aria-current={isCurrent("/solutions/smart-film") ? "page" : undefined} href="/solutions/smart-film" onClick={closeNavigation}><b>Smart Film</b><span>Switchable privacy glass</span></a>
                <a className={isCurrent("/solutions/roller-shades") ? "active" : ""} aria-current={isCurrent("/solutions/roller-shades") ? "page" : undefined} href="/solutions/roller-shades" onClick={closeNavigation}><b>Motorized Shades</b><span>Automated light control</span></a>
                <a className={isCurrent("/solutions/custom-drapery") ? "active" : ""} aria-current={isCurrent("/solutions/custom-drapery") ? "page" : undefined} href="/solutions/custom-drapery" onClick={closeNavigation}><b>Custom Drapery</b><span>Tailored premium fabrics</span></a>
                <a className={isCurrent("/solutions/cellular-shades") ? "active" : ""} aria-current={isCurrent("/solutions/cellular-shades") ? "page" : undefined} href="/solutions/cellular-shades" onClick={closeNavigation}><b>Cellular Shades</b><span>Insulated everyday comfort</span></a>
                <div><a className={isCurrent("/residential") ? "active" : ""} aria-current={isCurrent("/residential") ? "page" : undefined} href="/residential" onClick={closeNavigation}>Residential</a><a className={isCurrent("/commercial") ? "active" : ""} aria-current={isCurrent("/commercial") ? "page" : undefined} href="/commercial" onClick={closeNavigation}>Commercial</a></div>
              </div>
            )}
            <a className={isCurrent("/gallery") ? "active" : ""} aria-current={isCurrent("/gallery") ? "page" : undefined} href="/gallery" onClick={closeNavigation}>Gallery</a>
            <a className={isCurrent("/about") ? "active" : ""} aria-current={isCurrent("/about") ? "page" : undefined} href="/about" onClick={closeNavigation}>About</a>
            <a className={isCurrent("/contact") ? "active" : ""} aria-current={isCurrent("/contact") ? "page" : undefined} href="/contact" onClick={closeNavigation}>Contact</a>
            <a className="button button-gold mobile-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={closeNavigation}>SCHEDULE A CONSULTATION</a>
          </nav>
        </div>
      )}
    </header>
  );
}
