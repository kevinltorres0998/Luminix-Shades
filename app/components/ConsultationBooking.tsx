"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOOKING_URL } from "../lib/booking";
import styles from "./ConsultationBooking.module.css";

const INVITATION_SHOWN_KEY = "luminix-consultation-invitation-shown-v1";
const VISIT_STARTED_KEY = "luminix-consultation-visit-started-v1";
const INVITATION_DELAY = 15_000;

export default function ConsultationBooking() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const markInvitationShown = useCallback(() => {
    try {
      window.localStorage.setItem(INVITATION_SHOWN_KEY, "true");
    } catch {
      // Storage may be unavailable in privacy-restricted browsers.
    }
  }, []);

  const openBooking = useCallback(() => {
    markInvitationShown();
    setOpen(true);
  }, [markInvitationShown]);

  useEffect(() => {
    let timeoutId: number | undefined;

    try {
      if (window.localStorage.getItem(INVITATION_SHOWN_KEY)) return;

      const savedStart = Number(window.sessionStorage.getItem(VISIT_STARTED_KEY));
      const visitStarted = Number.isFinite(savedStart) && savedStart > 0 ? savedStart : Date.now();
      window.sessionStorage.setItem(VISIT_STARTED_KEY, String(visitStarted));

      const showWhenReady = () => {
        if (document.querySelector('[role="dialog"]')) {
          timeoutId = window.setTimeout(showWhenReady, 1_000);
          return;
        }
        openBooking();
      };

      const remaining = Math.max(0, INVITATION_DELAY - (Date.now() - visitStarted));
      timeoutId = window.setTimeout(showWhenReady, remaining);
    } catch {
      timeoutId = window.setTimeout(openBooking, INVITATION_DELAY);
    }

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [openBooking]);

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
