"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BOOKING_URL } from "../lib/booking";
import styles from "./ConsultationBooking.module.css";

type BookingStage = "closed" | "signature" | "scheduler";

export default function ConsultationBooking() {
  const [stage, setStage] = useState<BookingStage>("closed");
  const [schedulerReady, setSchedulerReady] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<BookingStage>(stage);

  const active = stage !== "closed";

  const closeBooking = useCallback(() => {
    setStage("closed");
  }, []);

  const openBooking = useCallback(() => {
    if (stageRef.current !== "closed") return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setStage("signature");
  }, []);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

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
    if (stage !== "signature") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setStage("scheduler");
    }, reducedMotion ? 320 : 1020);
    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("consultation-signature", stage === "signature");
    root.classList.toggle("consultation-scheduler", stage === "scheduler");
    return () => {
      root.classList.remove("consultation-signature", "consultation-scheduler");
    };
  }, [stage]);

  useEffect(() => {
    if (!active) return;

    document.documentElement.classList.add("consultation-open");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeBooking();
        return;
      }
      if (event.key !== "Tab" || stageRef.current !== "scheduler") return;

      const dialog = document.querySelector<HTMLElement>("[data-consultation-dialog]");
      const focusable = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href], iframe, [tabindex]:not([tabindex="-1"])')) : [];
      if (focusable.length === 0) return;
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
      returnFocusRef.current?.focus();
    };
  }, [active, closeBooking]);

  useEffect(() => {
    if (stage === "scheduler") closeButtonRef.current?.focus();
  }, [stage]);

  return (
    <div className={styles.bookingRoot} data-consultation-root>
      <div
        className={`${styles.websiteTransition} ${stage === "signature" ? styles.websiteTransitionVisible : styles.websiteTransitionHidden}`}
        data-luminix-site-transition
        aria-hidden="true"
      >
        <div className={styles.logoStage}>
          <Image className={styles.logoBase} src="/images/logo-white.png" alt="" width={2420} height={689} priority unoptimized />
          <span className={styles.logoSweep}>
            <Image src="/images/logo-white.png" alt="" width={2420} height={689} priority unoptimized />
          </span>
        </div>
      </div>

      <div
        className={`${styles.schedulerOverlay} ${stage === "scheduler" ? styles.schedulerOverlayOpen : styles.schedulerOverlayClosed}`}
        aria-hidden={stage !== "scheduler"}
        onMouseDown={(event) => {
          if (stage === "scheduler" && event.target === event.currentTarget) closeBooking();
        }}
      >
        <section
          className={styles.dialog}
          data-consultation-dialog
          role="dialog"
          aria-modal="true"
          aria-labelledby="consultation-title"
        >
          <div className={styles.heading}>
            <div>
              <span>PRIVATE CONSULTATION</span>
              <h2 id="consultation-title">Schedule your consultation.</h2>
              <p>Choose a time that works for you. Our team will help shape the right solution for your space.</p>
            </div>
            <button ref={closeButtonRef} type="button" tabIndex={stage === "scheduler" ? 0 : -1} className={styles.close} onClick={closeBooking} aria-label="Close consultation scheduler">×</button>
          </div>
          <div className={styles.scheduler}>
            <iframe
              className={schedulerReady ? styles.schedulerReady : ""}
              tabIndex={stage === "scheduler" ? 0 : -1}
              title="Schedule a consultation with Luminix Shades"
              src={`${BOOKING_URL}&embed=1`}
              onLoad={() => {
                setSchedulerReady(true);
              }}
            />
          </div>
          <div className={styles.fallback}>
            <span>HAVING TROUBLE WITH THE CALENDAR?</span>
            <a href={BOOKING_URL} tabIndex={stage === "scheduler" ? 0 : -1} target="_blank" rel="noopener noreferrer" data-booking-external>OPEN SCHEDULER IN A NEW TAB <b>↗</b></a>
          </div>
        </section>
      </div>
    </div>
  );
}
