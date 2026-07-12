"use client";

import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const homeAnchor = (id: string) => onHome ? `#${id}` : `/#${id}`;

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
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeNavigation = () => {
    setSolutionsOpen(false);
    setMobileOpen(false);
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
            <button className={`nav-trigger${pathname === "/solutions" ? " active" : ""}`} type="button" aria-expanded={solutionsOpen} aria-controls="solutions-mega-menu" onClick={() => setSolutionsOpen((open) => !open)} onFocus={() => setSolutionsOpen(true)}>
              Solutions <span aria-hidden="true">⌄</span>
            </button>
            <div className="mega-menu" id="solutions-mega-menu">
              <div className="mega-products">
                <a href="/solutions#smart-film" onClick={closeNavigation}>
                  <span className="mega-detail film-detail" aria-hidden="true" /><h3>Smart Film</h3>
                  <p>Switchable privacy glass for residential and commercial spaces.</p>
                </a>
                <a href="/solutions#motorized" onClick={closeNavigation}>
                  <span className="mega-detail shade-detail" aria-hidden="true" /><h3>Motorized Shades</h3>
                  <p>Automated window treatments designed for comfort, privacy, and light control.</p>
                </a>
                <a href="/solutions#drapery" onClick={closeNavigation}>
                  <span className="mega-detail drapery-detail" aria-hidden="true" /><h3>Custom Drapery</h3>
                  <p>Tailored designer drapery with premium fabrics and refined finishes.</p>
                </a>
              </div>
              <div className="mega-secondary">
                <a href="/solutions#residential" onClick={closeNavigation}>Residential <span aria-hidden="true">→</span></a>
                <a href="/solutions#commercial" onClick={closeNavigation}>Commercial <span aria-hidden="true">→</span></a>
              </div>
            </div>
          </div>
          <a href={homeAnchor("projects")}>Projects</a>
          <a className={pathname === "/about" ? "active" : ""} href="/about">About</a>
          <a href={homeAnchor("contact")}>Contact</a>
        </nav>

        <a className="button button-gold desktop-cta" href={homeAnchor("contact")}>SCHEDULE A CONSULTATION</a>
        <button className={`mobile-menu${mobileOpen ? " is-open" : ""}`} type="button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>
          <span /><span /><span />
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-panel">
          <nav aria-label="Mobile navigation">
            <a href={onHome ? "#top" : "/"} onClick={closeNavigation}>Home</a>
            <button className="mobile-solutions-toggle" type="button" aria-expanded={mobileSolutionsOpen} onClick={() => setMobileSolutionsOpen((open) => !open)}>
              Solutions <span aria-hidden="true">{mobileSolutionsOpen ? "−" : "+"}</span>
            </button>
            {mobileSolutionsOpen && (
              <div className="mobile-solutions">
                <a href="/solutions#smart-film" onClick={closeNavigation}><b>Smart Film</b><span>Switchable privacy glass</span></a>
                <a href="/solutions#motorized" onClick={closeNavigation}><b>Motorized Shades</b><span>Automated light control</span></a>
                <a href="/solutions#drapery" onClick={closeNavigation}><b>Custom Drapery</b><span>Tailored premium fabrics</span></a>
                <div><a href="/solutions#residential" onClick={closeNavigation}>Residential</a><a href="/solutions#commercial" onClick={closeNavigation}>Commercial</a></div>
              </div>
            )}
            <a href={homeAnchor("projects")} onClick={closeNavigation}>Projects</a>
            <a href="/about" onClick={closeNavigation}>About</a>
            <a href={homeAnchor("contact")} onClick={closeNavigation}>Contact</a>
            <a className="button button-gold mobile-cta" href={homeAnchor("contact")} onClick={closeNavigation}>SCHEDULE A CONSULTATION</a>
          </nav>
        </div>
      )}
    </header>
  );
}
