"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOOKING_URL } from "../lib/booking";
import styles from "./ConsultationBooking.module.css";

export default function ConsultationBooking() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openBooking = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    const handleBookingClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("data-booking-external") || anchor.href !== BOOKING_URL) return;
      event.preventDefault();
      openBooking();
    };

    document.addEventListener("click", handleBookingClick);
    return () => document.removeEventListener("click", handleBookingClick);
  }, [openBooking]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>("[data-consultation-dialog]");
    const focusable = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href], iframe, [tabindex]:not([tabindex="-1"])')) : [];
    document.documentElement.classList.add("consultation-open");
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
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

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.documentElement.classList.remove("consultation-open");
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className={styles.dialog} data-consultation-dialog role="dialog" aria-modal="true" aria-labelledby="consultation-title">
        <div className={styles.heading}>
          <div>
            <span>PRIVATE CONSULTATION</span>
            <h2 id="consultation-title">Schedule your consultation.</h2>
            <p>Choose a time that works for you. Our team will help shape the right solution for your space.</p>
          </div>
          <button ref={closeButtonRef} type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close consultation scheduler">×</button>
        </div>
        <div className={styles.scheduler}>
          <iframe title="Schedule a consultation with Luminix Shades" src={`${BOOKING_URL}&embed=1`} />
        </div>
        <div className={styles.fallback}>
          <span>HAVING TROUBLE WITH THE CALENDAR?</span>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" data-booking-external>OPEN SCHEDULER IN A NEW TAB <b>↗</b></a>
        </div>
      </section>
    </div>
  );
}
