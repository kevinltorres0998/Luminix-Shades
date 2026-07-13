"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import styles from "./solutions.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) { return <NextImage {...props} unoptimized />; }
function Fade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .76, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

const solutions = [
  { key: "film", name: "Smart Film", copy: "Instant privacy at the touch of a button.", image: "/images/smart-film-hero-v2.png", href: "/solutions/smart-film", label: "Privacy transforms instantly" },
  { key: "roller", name: "Motorized Roller Shades", copy: "Effortless light control. Elevated comfort.", image: "/images/hero.png", href: "/solutions/roller-shades", label: "Shades lower with quiet precision" },
  { key: "drapery", name: "Custom Drapery", copy: "Timeless softness, texture, and craftsmanship.", image: "/images/drapery-hero-sheer.png", href: "/solutions/custom-drapery", label: "Tailored fabric moves gracefully" },
  { key: "cellular", name: "Cellular Shades", copy: "Engineered for comfort. Designed for every room.", image: "/images/cellular-hero-winter.webp", href: "/solutions/cellular-shades", label: "Light softens as comfort increases" },
];

const recommendations = [
  { name: "Residential", image: "/images/residential.png", headline: "For the way you live.", description: "Layer privacy, comfort, and natural light around daily routines without interrupting the architecture.", products: ["Cellular Shades", "Roller Shades", "Custom Drapery"], combination: "Cellular Shades + Custom Drapery", note: "Insulation, softness, and complete light control." },
  { name: "Commercial", image: "/images/commercial.png", headline: "Performance at architectural scale.", description: "Create adaptable, consistent environments for workplaces, developments, and high-value commercial interiors.", products: ["Smart Film", "Roller Shades", "Cellular Shades"], combination: "Smart Film + Motorized Shades", note: "Flexible privacy with automated solar control." },
  { name: "Hospitality", image: "/images/about-hospitality.png", headline: "Comfort guests remember.", description: "Balance atmosphere, rest, and effortless operation across guest rooms, restaurants, and shared spaces.", products: ["Custom Drapery", "Blackout Shades", "Cellular Shades"], combination: "Drapery + Blackout Cellular", note: "Layered luxury with dependable room darkening." },
  { name: "Office", image: "/images/cellular-space-office-v2.webp", headline: "Focus without the glare.", description: "Support productive work with controllable privacy, softened daylight, and quieter, thermally stable interiors.", products: ["Smart Film", "Screen Shades", "Cellular Shades"], combination: "Smart Film + Screen Shades", note: "Meeting privacy and everyday glare reduction." },
  { name: "Healthcare", image: "/images/commercial-smart-film-cover-v3.png", headline: "Privacy with calm precision.", description: "Design cleaner, more reassuring environments with intuitive privacy and easy-to-maintain window solutions.", products: ["Smart Film", "Blackout Shades", "Cellular Shades"], combination: "Smart Film + Cellular Shades", note: "Instant discretion with acoustic and thermal comfort." },
];

const comparison = [
  ["Smart Film", 5, 3, 2, 5, 5],
  ["Roller Shades", 4, 5, 3, 4, 5],
  ["Custom Drapery", 4, 4, 3, 5, 4],
  ["Cellular Shades", 4, 4, 5, 4, 4],
];

const projects = [
  {
    name: "Miami Waterfront", location: "Miami Beach", type: "Waterfront Residence", image: "/images/smart-film.png",
    ratings: [["Smart Film", 5], ["Motorized Roller Shades", 4], ["Custom Drapery", 5], ["Cellular Shades", 2]] as [string, number][],
    combination: "Smart Film + Ripple Fold Linen Drapery",
    combinationItems: [["Smart Film", "/images/smart-film.png"], ["Ripple Fold Linen Drapery", "/images/drapery-room-linen.png"]],
    reasoning: "For a waterfront residence, preserving panoramic views is essential. Smart Film provides instant privacy without permanently blocking the scenery, while full-height linen drapery adds warmth, softness, acoustic comfort, and architectural elegance. Motorized Roller Shades remain an excellent complementary option for managing afternoon glare.",
    bestFor: ["Waterfront Homes", "Floor-to-Ceiling Windows", "Luxury Living Rooms", "Open Architecture"],
  },
  {
    name: "Brickell Residence", location: "Brickell", type: "High-Rise Residence", image: "/images/hero.png",
    ratings: [["Smart Film", 4], ["Motorized Roller Shades", 5], ["Custom Drapery", 4], ["Cellular Shades", 3]] as [string, number][],
    combination: "Motorized Screen Shades + Sheer Drapery",
    combinationItems: [["Motorized Screen Shades", "/images/roller-shades-demo-room.png"], ["Sheer Drapery", "/images/drapery-hero-sheer.png"]],
    reasoning: "High-rise glass invites extraordinary daylight but also creates glare and solar heat. Motorized Screen Shades provide precise daily control while preserving the skyline. A sheer drapery layer softens the architecture and adds movement, making the residence feel warmer after sunset.",
    bestFor: ["High-Rise Homes", "Panoramic Views", "Afternoon Sun", "Smart Living"],
  },
  {
    name: "Coral Gables Home", location: "Coral Gables", type: "Luxury Residence", image: "/images/drapery-room-linen.png",
    ratings: [["Smart Film", 2], ["Motorized Roller Shades", 3], ["Custom Drapery", 5], ["Cellular Shades", 4]] as [string, number][],
    combination: "Tailored Linen Drapery + Cellular Shades",
    combinationItems: [["Tailored Linen Drapery", "/images/drapery-room-linen.png"], ["Cellular Shades", "/images/cellular-compare-with.webp"]],
    reasoning: "The layered architecture benefits from materials that add softness and residential warmth. Full-height linen drapery creates elegant scale and acoustic comfort, while Cellular Shades provide discreet insulation and flexible privacy behind the textile layer.",
    bestFor: ["Layered Interiors", "Garden Views", "Formal Living", "Acoustic Comfort"],
  },
  {
    name: "Quiet Primary Suite", location: "Coconut Grove", type: "Primary Bedroom", image: "/images/cellular-hero-winter.webp",
    ratings: [["Smart Film", 2], ["Motorized Roller Shades", 4], ["Custom Drapery", 4], ["Cellular Shades", 5]] as [string, number][],
    combination: "Room-Darkening Cellular Shades + Drapery",
    combinationItems: [["Room-Darkening Cellular Shades", "/images/cellular-hero-winter.webp"], ["Blackout Drapery", "/images/drapery-room-blackout.png"]],
    reasoning: "A primary suite should protect rest before anything else. Room-darkening Cellular Shades deliver thermal stability, reduced noise, and dependable light control. Drapery completes the composition with softness and an additional layer of privacy and darkness.",
    bestFor: ["Primary Suites", "Restful Sleep", "Thermal Comfort", "Quiet Interiors"],
  },
  {
    name: "Downtown Workplace", location: "Downtown Miami", type: "Commercial Office", image: "/images/commercial.png",
    ratings: [["Smart Film", 5], ["Motorized Roller Shades", 5], ["Custom Drapery", 2], ["Cellular Shades", 3]] as [string, number][],
    combination: "Smart Film + Motorized Screen Shades",
    combinationItems: [["Smart Film", "/images/commercial-smart-film-cover-v3.png"], ["Motorized Screen Shades", "/images/commercial.png"]],
    reasoning: "Modern workplaces need to shift quickly between openness and discretion. Smart Film creates instant meeting-room privacy without visual clutter, while Motorized Screen Shades reduce glare and heat across exterior glazing. Together they form one precise, adaptable system.",
    bestFor: ["Executive Offices", "Meeting Rooms", "Glass Partitions", "Flexible Workplaces"],
  },
];

export default function SolutionsPage() {
  const [category, setCategory] = useState(0);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const panelCloseRef = useRef<HTMLButtonElement>(null);
  const panelScrollRef = useRef<HTMLDivElement>(null);
  const projectGridRef = useRef<HTMLDivElement>(null);
  const projectTriggerRef = useRef<HTMLButtonElement | null>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 760], [0, 54]);
  const active = recommendations[category];
  const selectedSpace = selectedProject === null ? null : projects[selectedProject];
  const panelOpen = selectedProject !== null;

  const closeProjectPanel = () => {
    setSelectedProject(null);
    window.setTimeout(() => projectTriggerRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!panelOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelCloseRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProjectPanel();
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !projectGridRef.current?.parentElement?.contains(target)) closeProjectPanel();
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [panelOpen]);

  useEffect(() => {
    if (selectedProject === null) return;
    panelScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedProject]);

  const scrollProjects = (direction: number) => projectGridRef.current?.scrollBy({ left: direction * 240, behavior: "smooth" });

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <motion.div className={styles.heroMedia} style={{ y: heroY }}><Image src="/images/solutions-showroom-hero-v2.webp" alt="Minimal waterfront residence designed around light, privacy, and comfort" fill priority loading="eager" sizes="100vw" /></motion.div>
        <div className={styles.heroShade} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .95, ease: [0.22, 1, 0.36, 1] }}>
          <span className={styles.kicker}>WINDOW SOLUTIONS</span>
          <h1>Designed around<br /><em>the way you live.</em></h1>
          <p>Every space is different. Discover the window treatment solution designed for your architecture, lifestyle, privacy, and comfort.</p>
          <a className="button button-gold" href="#showroom">EXPLORE SOLUTIONS</a>
        </motion.div>
      </section>

      <section className={styles.showroom} id="showroom">
        <Fade className={styles.sectionLead}><div><span className={styles.kicker}>OUR SOLUTIONS</span><h2>Explore. Experience. Imagine.</h2></div><p>Discover how each solution transforms a space. Hover or focus over each option to preview the difference.</p></Fade>
        <div className={styles.solutionGrid}>
          {solutions.map((item) => (
            <motion.a className={`${styles.solutionCard} ${styles[item.key]}`} href={item.href} key={item.name} aria-label={`Explore ${item.name}: ${item.label}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}>
              <Image src={item.image} alt={`${item.name} in a refined architectural interior`} fill sizes="(max-width: 760px) 100vw, 25vw" />
              <div className={styles.productEffect} aria-hidden="true"><i /><i /><i /><i /></div>
              <div className={styles.cardShade} />
              <div className={styles.cardCopy}><h3>{item.name}</h3><p>{item.copy}</p><span>EXPLORE <b aria-hidden="true">→</b></span></div>
            </motion.a>
          ))}
        </div>
      </section>

      <section className={styles.finder} id="finder">
        <Fade className={styles.finderHeading}><span className={styles.kicker}>FIND THE RIGHT SOLUTION</span><h2>Which solution<br />fits your space?</h2></Fade>
        <div className={styles.categoryTabs} role="tablist" aria-label="Choose a project type">
          {recommendations.map((item, index) => <button type="button" role="tab" aria-selected={category === index} key={item.name} onClick={() => setCategory(index)}><i aria-hidden="true">{["⌂", "▥", "♜", "▱", "✚"][index]}</i><span>{item.name}</span></button>)}
        </div>
        <div className={styles.finderStage}>
          <AnimatePresence mode="wait">
            <motion.div className={styles.finderImage} key={active.image} initial={{ opacity: 0, scale: 1.018 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .52, ease: [0.22, 1, 0.36, 1] }}><Image src={active.image} alt={`${active.name} window solution recommendation`} fill sizes="(max-width: 900px) 100vw, 50vw" /></motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div className={styles.finderCopy} key={active.name} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: .36 }}>
              <span className={styles.kicker}>{active.name.toUpperCase()}</span><h3>{active.headline}</h3><p>{active.description}</p>
              <div className={styles.productChips}>{active.products.map((product) => <span key={product}>{product}</span>)}</div>
              <div className={styles.combination}><small>RECOMMENDED COMBINATION</small><b>{active.combination}</b><p>{active.note}</p></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className={styles.compare}>
        <Fade className={styles.compareIntro}><span className={styles.kicker}>COMPARE SOLUTIONS</span><h2>Compare with<br />confidence.</h2><p>Different solutions. Different strengths. All designed to elevate your space.</p></Fade>
        <div className={styles.compareTable} role="table" aria-label="Window solution comparison">
          <div className={styles.tableHead} role="row"><span /><b>Privacy</b><b>Light Control</b><b>Energy Efficiency</b><b>Design & Luxury</b><b>Automation</b></div>
          {comparison.map(([name, ...scores]) => <div className={styles.tableRow} role="row" key={name as string}><strong>{name}</strong>{scores.map((score, index) => <span key={index} aria-label={`${score} out of 5`}>{"★".repeat(score as number)}<i>{"★".repeat(5 - (score as number))}</i></span>)}</div>)}
        </div>
      </section>

      <section className={`${styles.projects} ${panelOpen ? styles.projectsPanelOpen : ""}`} id="projects">
        <div className={styles.projectsIndex}>
          <Fade className={styles.projectsIntro}><span className={styles.kicker}>FEATURED SPACES</span><h2>Inspired by<br />real spaces.</h2><p>Every environment is different. Discover which combination of privacy, light control, comfort, and texture we would recommend for yours.</p></Fade>
          <div className={styles.projectGallery}>
          <div ref={projectGridRef} className={styles.projectGrid}>{projects.map((project, index) => (
            <motion.button
              type="button"
              key={project.name}
              className={selectedProject === index ? styles.activeProject : ""}
              onClick={(event) => { projectTriggerRef.current = event.currentTarget; setSelectedProject(index); }}
              aria-label={`View design recommendations for ${project.name}`}
              aria-pressed={selectedProject === index}
            >
              <Image src={project.image} alt={`${project.name} in ${project.location}`} fill sizes="(max-width: 760px) 100vw, 19vw" />
              <div className={styles.projectCardContent}>
                <h3>{project.name}</h3><p>{project.location} · {project.type}</p>
                <div className={styles.cardRecommendations}>{project.ratings.map(([solution, score]) => <span key={solution}><b>{solution}</b><i aria-label={`${score} out of 5 stars`}>{"★".repeat(score)}<em>{"☆".repeat(5 - score)}</em></i></span>)}</div>
                <div className={styles.cardCombination}><small>RECOMMENDED COMBINATION</small><strong>{project.combination}</strong></div>
              </div>
            </motion.button>
          ))}</div>
          <AnimatePresence>{panelOpen && <motion.div className={styles.projectCarouselNav} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><button type="button" onClick={() => scrollProjects(-1)} aria-label="Previous spaces">←</button><span>EXPLORE SPACES</span><button type="button" onClick={() => scrollProjects(1)} aria-label="Next spaces">→</button></motion.div>}</AnimatePresence>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div><h2>Not sure which solution<br />is right for your space?</h2><p>Schedule a design consultation and our experts will recommend the ideal combination of privacy, light control, comfort, and design for your project.</p><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a></div>
      </section>

      <SiteFooter />

      <AnimatePresence>
        {selectedSpace && (
          <motion.div className={styles.recommendationOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .24 }}>
            <motion.aside ref={panelRef} className={styles.recommendationPanel} role="dialog" aria-modal="false" aria-labelledby="recommendation-title" initial={{ opacity: 0, x: 46 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 34 }} transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }}>
              <button ref={panelCloseRef} type="button" className={styles.panelClose} onClick={closeProjectPanel} aria-label="Close recommendations"><span aria-hidden="true">×</span></button>
              <div ref={panelScrollRef} className={styles.panelScroll}>
                <AnimatePresence mode="wait" initial={false}>
                <motion.div className={styles.panelContent} key={selectedSpace.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }}>
                <span className={styles.kicker}>RECOMMENDATION FOR THIS SPACE</span>
                <h2 id="recommendation-title">{selectedSpace.name}</h2>
                <p className={styles.panelMeta}>{selectedSpace.location} <span>·</span> {selectedSpace.type}</p>
                <div className={styles.panelHero}><Image src={selectedSpace.image} alt={`${selectedSpace.name} recommendation`} fill sizes="(max-width:760px) 100vw, 520px" /></div>

                <section className={styles.panelSection}><h3>RECOMMENDED SOLUTIONS</h3><div className={styles.panelRatings}>{selectedSpace.ratings.map(([solution, score]) => <div key={solution}><span>{solution}</span><i aria-label={`${score} out of 5 stars`}>{"★".repeat(score)}<em>{"☆".repeat(5 - score)}</em></i></div>)}</div></section>

                <section className={styles.panelSection}><h3>WHY WE RECOMMEND THIS</h3><p>{selectedSpace.reasoning}</p></section>

                <section className={styles.panelSection}><h3>BEST FOR</h3><div className={styles.bestFor}>{selectedSpace.bestFor.map((item, index) => <div key={item}><i aria-hidden="true">{["⌂", "□", "◇", "⌗"][index]}</i><span>{item}</span></div>)}</div></section>

                <section className={styles.panelSection}><h3>RECOMMENDED COMBINATION</h3><div className={styles.combinationVisual}>{selectedSpace.combinationItems.map(([label, image], index) => <div key={label} className={styles.comboItem}><figure><Image src={image} alt="" fill sizes="110px" /></figure><span>{label}</span>{index === 0 && <b aria-hidden="true">+</b>}</div>)}</div></section>

                <a className="button button-gold" href="/#contact" onClick={closeProjectPanel}>SCHEDULE A DESIGN CONSULTATION</a>
                <button type="button" className={styles.exploreAnother} onClick={closeProjectPanel}>EXPLORE ANOTHER SPACE <span aria-hidden="true">←</span></button>
                </motion.div>
                </AnimatePresence>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
