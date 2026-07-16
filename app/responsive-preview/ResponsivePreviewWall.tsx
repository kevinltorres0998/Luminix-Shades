"use client";

import { useRef, useState, type CSSProperties, type FormEvent } from "react";

import styles from "./responsive-preview.module.css";

type DeviceId = "desktop" | "tablet" | "smartphone";
type Orientation = "portrait" | "landscape";

type Device = {
  id: DeviceId;
  label: string;
  portrait: { width: number; height: number };
  canRotate: boolean;
  wallScale: number;
  expandedScale: number;
};

const DEVICES: readonly Device[] = [
  {
    id: "desktop",
    label: "Desktop",
    portrait: { width: 1440, height: 900 },
    canRotate: false,
    wallScale: 0.4,
    expandedScale: 0.75,
  },
  {
    id: "tablet",
    label: "Tablet",
    portrait: { width: 768, height: 1024 },
    canRotate: true,
    wallScale: 0.4,
    expandedScale: 0.72,
  },
  {
    id: "smartphone",
    label: "Smartphone",
    portrait: { width: 390, height: 844 },
    canRotate: true,
    wallScale: 0.4,
    expandedScale: 0.88,
  },
];

const ROUTE_SUGGESTIONS = [
  { label: "Home", path: "/" },
  { label: "Residential", path: "/residential" },
  { label: "Commercial", path: "/commercial" },
  { label: "Smart Film", path: "/solutions/smart-film" },
  { label: "Roller Shades", path: "/solutions/roller-shades" },
  { label: "Custom Drapery", path: "/solutions/custom-drapery" },
  { label: "Cellular Shades", path: "/solutions/cellular-shades" },
  { label: "Solutions", path: "/solutions" },
] as const;

type FrameVariables = CSSProperties & {
  "--frame-width": string;
  "--frame-height": string;
  "--preview-scale": number;
};

function dimensionsFor(device: Device, orientation: Orientation) {
  if (!device.canRotate || orientation === "portrait") return device.portrait;
  return { width: device.portrait.height, height: device.portrait.width };
}

function normalizeRoute(value: string) {
  const route = value.trim() || "/";
  const url = new URL(route, window.location.origin);

  if (url.origin !== window.location.origin) {
    throw new Error("Use a route from this site, for example /about.");
  }

  const normalizedPath = url.pathname.replace(/\/+$/, "") || "/";
  if (normalizedPath === "/responsive-preview") {
    throw new Error("Responsive Preview cannot load itself. Choose another route.");
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export default function ResponsivePreviewWall() {
  const previewScrollerRef = useRef<HTMLDivElement>(null);
  const [routeInput, setRouteInput] = useState("/");
  const [activeRoute, setActiveRoute] = useState("/");
  const [routeError, setRouteError] = useState("");
  const [orientations, setOrientations] = useState<Record<DeviceId, Orientation>>({
    desktop: "landscape",
    tablet: "portrait",
    smartphone: "portrait",
  });
  const [visible, setVisible] = useState<Record<DeviceId, boolean>>({
    desktop: true,
    tablet: true,
    smartphone: true,
  });
  const [reloadKeys, setReloadKeys] = useState<Record<DeviceId, number>>({
    desktop: 0,
    tablet: 0,
    smartphone: 0,
  });
  const [expanded, setExpanded] = useState<DeviceId | null>(null);
  const [showDeviceFrames, setShowDeviceFrames] = useState(true);
  const [horizontalPosition, setHorizontalPosition] = useState(0);

  function applyRoute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const route = normalizeRoute(routeInput);
      setRouteInput(route);
      setActiveRoute(route);
      setRouteError("");
      reloadAll();
    } catch (error) {
      setRouteError(error instanceof Error ? error.message : "Enter a valid local route.");
    }
  }

  function reloadAll() {
    setReloadKeys((current) => ({
      desktop: current.desktop + 1,
      tablet: current.tablet + 1,
      smartphone: current.smartphone + 1,
    }));
  }

  function reloadDevice(id: DeviceId) {
    setReloadKeys((current) => ({ ...current, [id]: current[id] + 1 }));
  }

  function toggleOrientation(id: DeviceId) {
    setOrientations((current) => ({
      ...current,
      [id]: current[id] === "portrait" ? "landscape" : "portrait",
    }));
  }

  function toggleVisibility(id: DeviceId) {
    setVisible((current) => ({ ...current, [id]: !current[id] }));
    if (expanded === id) setExpanded(null);
  }

  function movePreviewWall(position: number) {
    const scroller = previewScrollerRef.current;
    setHorizontalPosition(position);
    if (!scroller) return;

    const availableDistance = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollLeft = availableDistance * (position / 100);
  }

  function syncHorizontalPosition() {
    const scroller = previewScrollerRef.current;
    if (!scroller) return;

    const availableDistance = scroller.scrollWidth - scroller.clientWidth;
    setHorizontalPosition(availableDistance > 0 ? (scroller.scrollLeft / availableDistance) * 100 : 0);
  }

  return (
    <main className={styles.wall}>
      <header className={styles.toolbar}>
        <div className={styles.headingGroup}>
          <p>Private development tool</p>
          <h1>Responsive Preview Wall</h1>
        </div>

        <form className={styles.routeForm} onSubmit={applyRoute}>
          <label htmlFor="preview-route">Route</label>
          <input
            aria-describedby={routeError ? "route-error" : undefined}
            id="preview-route"
            list="preview-routes"
            onChange={(event) => setRouteInput(event.target.value)}
            placeholder="/about"
            spellCheck={false}
            value={routeInput}
          />
          <datalist id="preview-routes">
            {ROUTE_SUGGESTIONS.map((route) => (
              <option key={route.path} value={route.path}>
                {route.label}
              </option>
            ))}
          </datalist>
          <button type="submit">Load route</button>
          <button type="button" onClick={reloadAll}>Reload all</button>
        </form>

        <div className={styles.globalControls} aria-label="Visible devices">
          {DEVICES.map((device) => (
            <button
              aria-pressed={visible[device.id]}
              className={visible[device.id] ? styles.active : undefined}
              key={device.id}
              onClick={() => toggleVisibility(device.id)}
              type="button"
            >
              {device.label}
            </button>
          ))}
          <button
            aria-pressed={showDeviceFrames}
            className={showDeviceFrames ? styles.active : undefined}
            onClick={() => setShowDeviceFrames((current) => !current)}
            type="button"
          >
            Device frames
          </button>
          <label className={styles.panControl} htmlFor="preview-position">
            <span>Move previews</span>
            <input
              aria-label="Move between Desktop, Tablet, and Smartphone previews"
              id="preview-position"
              max="100"
              min="0"
              onChange={(event) => movePreviewWall(Number(event.target.value))}
              step="1"
              type="range"
              value={horizontalPosition}
            />
          </label>
        </div>

        {routeError && <p className={styles.error} id="route-error" role="alert">{routeError}</p>}
      </header>

      <div className={styles.previewScroller} onScroll={syncHorizontalPosition} ref={previewScrollerRef}>
        <section className={styles.grid} aria-label="Responsive page previews">
          {DEVICES.map((device) => {
          if (!visible[device.id]) return null;

          const orientation = orientations[device.id];
          const dimensions = dimensionsFor(device, orientation);
          const isExpanded = expanded === device.id;
          const frameStyle: FrameVariables = {
            "--frame-width": `${dimensions.width}px`,
            "--frame-height": `${dimensions.height}px`,
            "--preview-scale": isExpanded ? device.expandedScale : device.wallScale,
          };

          return (
            <article
              className={`${styles.preview} ${isExpanded ? styles.expanded : ""}`}
              key={device.id}
              style={frameStyle}
            >
              <div className={styles.labelRow}>
                <div>
                  <h2>{device.label}</h2>
                  <span>{dimensions.width} x {dimensions.height}</span>
                </div>
                <div className={styles.deviceControls}>
                  {device.canRotate && (
                    <button type="button" onClick={() => toggleOrientation(device.id)}>
                      {orientation === "portrait" ? "Landscape" : "Portrait"}
                    </button>
                  )}
                  <button type="button" onClick={() => reloadDevice(device.id)}>Reload</button>
                  <button type="button" onClick={() => setExpanded(isExpanded ? null : device.id)}>
                    {isExpanded ? "Close" : "Expand"}
                  </button>
                  <button type="button" onClick={() => toggleVisibility(device.id)}>Hide</button>
                </div>
              </div>

              <div className={styles.frameSpace}>
                <div
                  className={`${styles.frameShell} ${showDeviceFrames ? styles.deviceFrame : ""} ${styles[device.id]}`}
                >
                  <iframe
                    key={`${device.id}-${reloadKeys[device.id]}`}
                    src={activeRoute}
                    title={`${device.label} preview of ${activeRoute}`}
                  />
                </div>
              </div>
            </article>
          );
          })}
        </section>
      </div>
    </main>
  );
}
