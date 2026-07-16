"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import styles from "./AIConcierge.module.css";

const AIConciergePanel = lazy(() => import("./AIConciergePanel"));

export default function AIConciergeLauncher() {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { setOpen(sessionStorage.getItem("luminix-ai-concierge-open") === "true"); } catch { /* session storage is optional */ }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const updateOpen = (next: boolean) => {
    setOpen(next);
    try { sessionStorage.setItem("luminix-ai-concierge-open", String(next)); } catch { /* session storage is optional */ }
    if (!next) requestAnimationFrame(() => launcherRef.current?.focus());
  };

  return (
    <div className={styles.root} data-ai-concierge-root>
      {open && <Suspense fallback={null}><AIConciergePanel onClose={() => updateOpen(false)} /></Suspense>}
      <button
        ref={launcherRef}
        type="button"
        className={`${styles.launcher} ${open ? styles.launcherOpen : ""}`}
        onClick={() => updateOpen(!open)}
        aria-label={open ? "Close Luminix AI Concierge" : "Open Luminix AI Concierge"}
        aria-expanded={open}
        aria-controls="luminix-ai-concierge-dialog"
        aria-describedby="luminix-ai-concierge-tooltip"
        data-ai-concierge-launcher
      >
        <span className={styles.sparkle} aria-hidden="true" />
        <span id="luminix-ai-concierge-tooltip" className={styles.tooltip} role="tooltip">Luminix AI Concierge</span>
      </button>
    </div>
  );
}
