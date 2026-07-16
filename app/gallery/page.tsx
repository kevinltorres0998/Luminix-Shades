"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { BOOKING_URL } from "../lib/booking";
import { galleryFilters, galleryProjects, gallerySpaces, serviceAreas, type GalleryProject } from "./gallery-data";
import styles from "./gallery.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

function Stars({ score }: { score: number }) {
  return <span className={styles.stars} aria-label={`${score} out of 5 recommendation`}><b>{"★".repeat(score)}</b><i>{"☆".repeat(5 - score)}</i></span>;
}

function SmartFilmControl() {
  const reducedMotion = useReducedMotion();
  const [powered, setPowered] = useState(false);

  return (
    <div className={styles.productDemo} data-gallery-film-state={powered ? "on" : "off"}>
      <Image src="/images/smart-film-demo-clear.png" alt="Conference room with switchable Smart Film glass" fill sizes="(max-width: 850px) 100vw, 46vw" unoptimized />
      <div className={`${styles.galleryFilm} ${powered ? styles.galleryFilmPowered : ""}`} aria-hidden="true">
        {[0, 1, 2].map((pane) => <motion.i key={pane} animate={{ opacity: powered ? 0 : 1, filter: powered ? "blur(0px)" : "blur(5px)" }} transition={{ duration: reducedMotion ? .01 : .3, ease: [0.45, 0, 0.2, 1] }} />)}
      </div>
      <div className={styles.galleryFrameLayer} aria-hidden="true"><i /><i /><i /><i /><b /><b /></div>
      <div className={styles.filmControl}>
        <div className={styles.demoStatus}><span>POWER</span><strong>{powered ? "ON" : "OFF"}</strong></div>
        <button className={`${styles.gallerySwitch} ${powered ? styles.gallerySwitchOn : ""}`} type="button" aria-label={`Turn Smart Film ${powered ? "off for privacy" : "on for clear visibility"}`} aria-pressed={powered} onClick={() => setPowered((current) => !current)}>
          <span /><i />
        </button>
        <p className={styles.demoNote}>{powered ? "Crystal clear visibility." : "Instant privacy."}</p>
      </div>
    </div>
  );
}

function RollerShadeControl() {
  const reducedMotion = useReducedMotion();
  const [closed, setClosed] = useState(false);

  return (
    <div className={styles.productDemo} data-gallery-shade-state={closed ? "closed" : "open"}>
      <Image src="/images/roller-shades-demo-room.png" alt="Waterfront living room with four motorized roller shades" fill sizes="(max-width: 850px) 100vw, 46vw" unoptimized />
      <motion.div className={styles.galleryRoomDim} aria-hidden="true" initial={false} animate={{ opacity: closed ? 1 : 0 }} transition={{ duration: reducedMotion ? .01 : 1.15, ease: [0.45, 0, 0.2, 1] }} />
      <div className={styles.galleryShadeHardware} aria-hidden="true">{[0, 1, 2, 3].map((panel) => <i key={panel} />)}</div>
      <div className={styles.galleryShades} aria-hidden="true">
        {[0, 1, 2, 3].map((panel) => <motion.i key={panel} initial={false} animate={{ scaleY: closed ? 1 : .025 }} transition={{ duration: reducedMotion ? .01 : 1.35, delay: reducedMotion ? 0 : panel * .095, ease: [0.65, 0, 0.35, 1] }} />)}
      </div>
      <div className={styles.demoStatus}><span>POSITION</span><strong>{closed ? "CLOSED" : "OPEN"}</strong></div>
      <button className={`${styles.shadeButton} ${closed ? styles.shadeButtonClosed : ""}`} type="button" aria-label={`${closed ? "Raise" : "Lower"} all four motorized roller shades`} aria-pressed={closed} onClick={() => setClosed((current) => !current)}>
        <span aria-hidden="true">{closed ? "↑" : "↓"}</span>
      </button>
      <p className={styles.demoNote}>{closed ? "Privacy and softened daylight." : "Open view and natural light."}</p>
    </div>
  );
}

function SouthFloridaMap() {
  return (
    <Image className={styles.southFloridaMap} src="/images/south-florida-basemap.webp" alt="Detailed road and city map of Broward and Palm Beach counties" fill sizes="(max-width: 900px) 100vw, 45vw" unoptimized />
  );
}

function ProjectCard({ project, onSelect }: { project: GalleryProject; onSelect: () => void }) {
  return (
    <motion.button
      layout
      type="button"
      data-project-card
      className={`${styles.projectCard} ${styles[project.size]}`}
      onClick={onSelect}
      aria-label={`View ${project.title}, Concept Visualization`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: .44, ease }}
    >
      <Image src={project.featuredImage} alt={`${project.title} architectural concept visualization`} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" />
      <span className={styles.projectShade} />
      <span className={styles.projectCopy}>
        <small>CONCEPT VISUALIZATION</small>
        <strong>{project.title}</strong>
        <em>{project.sector === "residential" ? "Residential" : "Commercial"}</em>
        <span>{project.solutions.join(" · ")}</span>
        <i>{project.location} &nbsp;|&nbsp; {project.statusLabel} &nbsp;|&nbsp; {project.solutions.length} Solutions</i>
      </span>
      <b className={styles.projectArrow}>→</b>
    </motion.button>
  );
}

function DetailCard({ title, subtitle, image, position = "50% 50%", size = "cover" }: { title: string; subtitle: string; image: string; position?: string; size?: string }) {
  return <article><div style={{ backgroundImage: `url(${image})`, backgroundPosition: position, backgroundSize: size }} /><h3>{title}</h3><p>{subtitle}</p></article>;
}

export default function GalleryPage() {
  const reducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);
  const [compactPanel, setCompactPanel] = useState(false);
  const [selectedArea, setSelectedArea] = useState("Fort Lauderdale");
  const spaceTrackRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const filteredProjects = useMemo(() => galleryProjects.filter((project) => {
    const filterMatch = activeFilter === "All" ||
      (activeFilter === "Residential" && project.sector === "residential") ||
      (activeFilter === "Commercial" && project.sector === "commercial") ||
      project.categories.includes(activeFilter);
    return filterMatch && (!selectedSpace || project.spaces.includes(selectedSpace));
  }), [activeFilter, selectedSpace]);

  const areaProjects = useMemo(() => galleryProjects.filter((project) => project.serviceArea === selectedArea), [selectedArea]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const update = () => setCompactPanel(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") setSelectedProject(null); };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-gallery-panel]") && !target.closest("[data-project-card]")) setSelectedProject(null);
    };
    document.addEventListener("pointerdown", outside);
    window.setTimeout(() => closeRef.current?.focus(), 80);
    return () => document.removeEventListener("pointerdown", outside);
  }, [selectedProject]);

  const chooseFilter = (filter: string) => { setActiveFilter(filter); setSelectedSpace(null); };
  const chooseSpace = (space: string) => {
    setSelectedSpace((current) => current === space ? null : space);
    setActiveFilter("All");
    window.setTimeout(() => projectsRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }), 80);
  };
  const showSector = (sector: "Residential" | "Commercial") => {
    chooseFilter(sector);
    projectsRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <main className={`${styles.page} ${selectedProject ? styles.panelOpen : ""}`}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <Image src="/images/hero.png" alt="Waterfront luxury interior at dusk with architectural window treatments" fill priority sizes="100vw" />
        <div className={styles.heroShade} />
        <motion.div className={styles.heroCopy} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .9, ease }}>
          <span className={styles.kicker}>SELECTED WORKS</span>
          <h1>Every project<br />tells a different<br /><em>story.</em></h1>
          <p>Explore a curated collection of residential and commercial environments where light, privacy and architecture work together.</p>
          <div><button className="button button-outline" type="button" onClick={() => showSector("Residential")}>VIEW RESIDENTIAL</button><button className="button button-gold" type="button" onClick={() => showSector("Commercial")}>VIEW COMMERCIAL</button></div>
        </motion.div>
        <a className={styles.heroCue} href="#browse">CURATED WORK <span>⌄</span></a>
      </section>

      <section className={styles.browse} id="browse" ref={projectsRef}>
        <span className={styles.kicker}>BROWSE PROJECTS</span>
        <div className={styles.filters} role="toolbar" aria-label="Filter gallery projects">
          {galleryFilters.map((filter) => <button type="button" key={filter} aria-pressed={activeFilter === filter && !selectedSpace} className={activeFilter === filter && !selectedSpace ? styles.activeFilter : ""} onClick={() => chooseFilter(filter)}>{filter}</button>)}
        </div>
        {selectedSpace && <button className={styles.spaceNotice} type="button" onClick={() => setSelectedSpace(null)}>SPACE: {selectedSpace} <b>×</b></button>}
        <motion.div layout className={styles.projectGrid}>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} onSelect={() => setSelectedProject(project)} />)}
          </AnimatePresence>
        </motion.div>
        {filteredProjects.length === 0 && <div className={styles.emptyState}><h2>No current study matches this selection.</h2><button type="button" onClick={() => { setSelectedSpace(null); setActiveFilter("All"); }}>VIEW ALL PROJECTS</button></div>}
      </section>

      <section className={styles.spaces}>
        <div className={styles.sectionHeading}><span className={styles.kicker}>BROWSE BY SPACE</span><p>Explore the environments where each solution performs differently.</p></div>
        <div className={styles.spaceTrack} ref={spaceTrackRef} onWheel={(event) => { if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) { event.preventDefault(); event.currentTarget.scrollBy({ left: event.deltaY, behavior: "smooth" }); } }}>
          {gallerySpaces.map(([space, image, description], index) => <button type="button" key={space} aria-pressed={selectedSpace === space} onClick={() => chooseSpace(space)} className={selectedSpace === space ? styles.activeSpace : ""}>
            <Image src={image} alt={`${space} window treatment environment`} fill sizes="210px" />
            <span className={styles.spaceShade} /><i aria-hidden="true"><b /><b /></i><strong>{space}</strong><small>{description}</small>
          </button>)}
        </div>
        <nav className={styles.spaceControls} aria-label="Browse spaces"><button type="button" aria-label="Previous spaces" onClick={() => spaceTrackRef.current?.scrollBy({ left: -spaceTrackRef.current.clientWidth * .72, behavior: "smooth" })}>←</button><button type="button" aria-label="Next spaces" onClick={() => spaceTrackRef.current?.scrollBy({ left: spaceTrackRef.current.clientWidth * .72, behavior: "smooth" })}>→</button></nav>
      </section>

      <section className={styles.details}>
        <span className={styles.kicker}>DETAILS MATTER</span>
        <div>
          <DetailCard title="Ripple Fold" subtitle="Linen Drapery" image="/images/drapery-pleat-library.png" position="0% center" size="400% 100%" />
          <DetailCard title="Smart Film Edge" subtitle="Seamless Integration" image="/images/about-smart-film-detail.png" />
          <DetailCard title="Motorized System" subtitle="Precision Engineering" image="/images/about-motor-detail.png" />
          <DetailCard title="Linen Texture" subtitle="Natural Elegance" image="/images/drapery-fabric-library.png" position="0% center" size="500% 100%" />
          <DetailCard title="Cellular Fabric" subtitle="Energy Efficiency" image="/images/cellular-compare-with.webp" />
          <DetailCard title="Track System" subtitle="Silent Performance" image="/images/smart-film-control-detail.png" />
        </div>
      </section>

      <section className={styles.comparisons}>
        <article><span className={styles.kicker}>SMART FILM TOTAL · POWER CONTROL</span><SmartFilmControl /></article>
        <article><span className={styles.kicker}>ROLLER SHADES · MOTORIZED CONTROL</span><RollerShadeControl /></article>
      </section>

      <section className={styles.mapSection}>
        <div className={styles.mapIntro}><span className={styles.kicker}>PROJECTS ACROSS</span><h2>South Florida</h2><p>Local expertise. Premium results. From waterfront estates to commercial developments, we bring architectural solutions to every environment.</p><small>Markers identify active service areas, not completed-project claims.</small><a className={styles.textLink} href="#browse">VIEW ALL PROJECTS <b>→</b></a></div>
        <div className={styles.mapCanvas}><div className={styles.mapViewport}><SouthFloridaMap />{serviceAreas.map((area) => <button type="button" key={area.name} style={{ left: `${area.x}%`, top: `${area.y}%` }} className={selectedArea === area.name ? styles.activeMarker : ""} onClick={() => setSelectedArea(area.name)} aria-label={`${area.name}, active service area`}><i /><span>{area.name}</span></button>)}</div><span className={styles.mapAttribution}>© OpenStreetMap contributors · © CARTO</span></div>
        <div className={styles.areaProjects}><span className={styles.kicker}>FEATURED IN THIS AREA</span><h3>{selectedArea}</h3><small>ACTIVE SERVICE AREA</small>{areaProjects.length ? areaProjects.map((project) => <button type="button" key={project.id} onClick={() => setSelectedProject(project)} data-project-card><Image src={project.featuredImage} alt="" width={92} height={62} unoptimized /><span><b>{project.title}</b><i>Concept Visualization · {project.solutions.length} Solutions</i></span></button>) : <p>No gallery study is currently assigned to this service area. A tailored concept can be developed for your project.</p>}<a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">DISCUSS A PROJECT <b>→</b></a></div>
      </section>

      <section className={styles.trustStrip} aria-label="Luminix portfolio principles"><div><b>TAILORED</b><span>Designed for each space</span></div><div><b>INTEGRATED</b><span>Complete solution strategies</span></div><div><b>LOCAL</b><span>South Florida expertise</span></div><div><b>PRECISE</b><span>Details considered carefully</span></div><div><b>EVOLVING</b><span>Concepts ready for real projects</span></div></section>

      <section className={styles.finalCta} id="contact">
        <Image src="/images/drapery-final-sunset.png" alt="Luxury waterfront interior at sunset" fill sizes="100vw" />
        <div />
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .8, ease }}>
          <h2>The next project<br />could be <em>yours.</em></h2>
          <p>Every environment begins with a conversation about how it should feel.</p>
          <span><a className="button button-gold" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">SCHEDULE A CONSULTATION</a><Link className="button button-outline" href="/plan-your-project">REQUEST A QUOTE</Link></span>
        </motion.section>
      </section>

      <SiteFooter />

      <AnimatePresence>
        {selectedProject && <>
          <motion.div className={styles.panelScrim} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside data-gallery-panel className={styles.projectPanel} role="dialog" aria-modal={compactPanel} aria-labelledby="gallery-project-title" initial={compactPanel ? { y: "100%" } : { x: "100%" }} animate={compactPanel ? { y: 0 } : { x: 0 }} exit={compactPanel ? { y: "100%" } : { x: "100%" }} transition={{ duration: reducedMotion ? .01 : .5, ease }}>
            <button ref={closeRef} className={styles.panelClose} type="button" onClick={() => setSelectedProject(null)} aria-label="Close project details">×</button>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={selectedProject.id} initial={{ opacity: 0, x: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reducedMotion ? 0 : -10 }} transition={{ duration: reducedMotion ? .01 : .28 }}>
                <span className={styles.kicker}>CONCEPT VISUALIZATION</span>
                <h2 id="gallery-project-title">{selectedProject.title}</h2>
                <p className={styles.panelMeta}>{selectedProject.location}<br />{selectedProject.sector === "residential" ? "Residential" : "Commercial"} · {selectedProject.statusLabel}</p>
                <div className={styles.panelHero}><Image src={selectedProject.featuredImage} alt={`${selectedProject.title} concept visualization`} fill sizes="(max-width: 900px) 100vw, 35vw" /></div>
                <section><small>PROPOSED SOLUTIONS</small>{selectedProject.recommendations.map(([name, score]) => <div className={styles.panelRating} key={name}><span>{name}</span><Stars score={score} /></div>)}</section>
                <section><small>PROJECT STORY</small><p>{selectedProject.projectStory}</p></section>
                <section><small>DESIGN OBJECTIVE</small><p>{selectedProject.objective}</p></section>
                <section><small>PROPOSED PRODUCTS</small><ul>{selectedProject.solutions.map((solution) => <li key={solution}>{solution}</li>)}</ul></section>
                <section><small>BEST COMBINATION</small><div className={styles.panelCombination}><strong>{selectedProject.bestCombination[0]}</strong><i>+</i><strong>{selectedProject.bestCombination[1]}</strong></div><p>{selectedProject.proposedStrategy}</p></section>
                <a className="button button-gold" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">SCHEDULE A CONSULTATION</a>
                <button className={styles.panelSecondary} type="button" onClick={() => { setSelectedProject(null); projectsRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); }}>EXPLORE SIMILAR PROJECTS <b>→</b></button>
              </motion.div>
            </AnimatePresence>
          </motion.aside>
        </>}
      </AnimatePresence>
    </main>
  );
}
