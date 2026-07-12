"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import { useState } from "react";
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
    name: "Miami Waterfront", category: "Smart Film", location: "Miami Beach", image: "/images/smart-film.png", interaction: "film",
    title: "Privacy without surrendering the horizon.",
    overview: "A waterfront residence needed instant discretion while preserving uninterrupted views and the clarity of its architecture. Smart Film created privacy on demand without adding tracks, textiles, or visual weight.",
    goal: "We wanted complete privacy without sacrificing our panoramic waterfront views.",
    products: ["Smart Film Total", "Low-profile controls", "Smart automation"],
    benefits: ["Instant Privacy", "Uninterrupted Views", "Minimal Architecture", "Smart Automation"],
    gallery: ["/images/smart-film-hero-v2.png", "/images/smart-film-demo-clear.png", "/images/residential-smart-film-cover-v3.png"],
  },
  {
    name: "Brickell Residence", category: "Motorized Roller Shades", location: "Brickell", image: "/images/hero.png", interaction: "roller",
    title: "Daylight composed with quiet precision.",
    overview: "Floor-to-ceiling glazing brought extraordinary light—and demanding heat and glare. Four independently motorized screen shades now move in harmony, protecting comfort while keeping the skyline present.",
    goal: "We wanted the view to remain the focus, with effortless control from morning through sunset.",
    products: ["Motorized Screen Shades", "Somfy automation", "Minimal white cassettes"],
    benefits: ["Glare Reduction", "Solar Protection", "Quiet Operation", "Scene Control"],
    gallery: ["/images/roller-shades-demo-room.png", "/images/about-hospitality.png", "/images/residential.png"],
  },
  {
    name: "Coral Gables Home", category: "Custom Drapery", location: "Coral Gables", image: "/images/drapery-room-linen.png", interaction: "drapery",
    title: "Softness tailored to the architecture.",
    overview: "The interior called for warmth without heaviness. Custom linen drapery was proportioned to the room, ceiling-mounted, and hand-finished to soften daylight and frame the garden with quiet elegance.",
    goal: "We wanted the room to feel softer and more complete, without losing its clean modern character.",
    products: ["Ivory Linen", "Ripple Fold", "Champagne hardware"],
    benefits: ["Filtered Daylight", "Tailored Fullness", "Acoustic Softness", "Timeless Finish"],
    gallery: ["/images/drapery-hero-sheer.png", "/images/drapery-room-velvet.png", "/images/drapery-final-sunset.png"],
  },
  {
    name: "Quiet Primary Suite", category: "Cellular Shades", location: "Coconut Grove", image: "/images/cellular-hero-winter.webp", interaction: "cellular",
    title: "A calmer room, engineered for rest.",
    overview: "This primary suite needed deeper darkness, more stable temperatures, and a quieter atmosphere. Cellular Shades added an insulating layer that transformed comfort without competing with the restrained interior.",
    goal: "We wanted better sleep and a room that felt consistently calm in every season.",
    products: ["Room Darkening Cellular", "Top-down control", "Concealed motorization"],
    benefits: ["Thermal Comfort", "Room Darkening", "Noise Reduction", "Energy Efficiency"],
    gallery: ["/images/cellular-compare-with.webp", "/images/cellular-space-office-v2.webp", "/images/cellular-space-nursery-v2.webp"],
  },
  {
    name: "Downtown Workplace", category: "Smart Film + Shades", location: "Downtown Miami", image: "/images/commercial.png", interaction: "combined",
    title: "Adaptable privacy at architectural scale.",
    overview: "A high-performance workplace required meeting-room privacy, glare management, and consistent visual order. Smart Film and automated shades were integrated as one responsive system for focus, openness, and control.",
    goal: "We needed spaces that could shift from open collaboration to complete discretion in seconds.",
    products: ["Smart Film Light", "Motorized Screen Shades", "Central automation"],
    benefits: ["Flexible Privacy", "Glare Control", "Unified Automation", "Professional Finish"],
    gallery: ["/images/commercial-smart-film-cover-v3.png", "/images/commercial.png", "/images/smart-film-hero-v2.png"],
  },
];

export default function SolutionsPage() {
  const [category, setCategory] = useState(0);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projectReveal, setProjectReveal] = useState(52);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 760], [0, 54]);
  const active = recommendations[category];

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

      <section className={styles.projects} id="projects">
        <AnimatePresence mode="wait" initial={false}>
          {selectedProject === null ? (
            <motion.div className={styles.projectsIndex} key="project-index" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: .985 }} transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }}>
              <Fade className={styles.projectsIntro}><span className={styles.kicker}>FEATURED PROJECTS</span><h2>Inspired by<br />real spaces.</h2><p>See how our solutions transform architecture into elevated experiences.</p></Fade>
              <div className={styles.projectGrid}>{projects.map((project, index) => <motion.button type="button" key={project.name} whileHover={{ y: -4 }} onClick={() => { setProjectReveal(52); setSelectedProject(index); }} aria-label={`Explore ${project.name} case study`}><Image src={project.image} alt={`${project.name} featuring ${project.category}`} fill sizes="(max-width: 760px) 100vw, 19vw" /><div><h3>{project.name}</h3><p>{project.category}</p><span>{project.location}</span></div></motion.button>)}</div>
            </motion.div>
          ) : (() => {
            const project = projects[selectedProject];
            return (
              <motion.article className={styles.caseStudy} key={project.name} initial={{ opacity: 0, y: 24, scale: .992 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}>
                <div className={`${styles.caseHero} ${styles[`case_${project.interaction}`]}`}>
                  <Image src={project.image} alt={`${project.name} architectural project`} fill priority sizes="100vw" />
                  {project.interaction === "film" && <div className={styles.filmState} style={{ clipPath: `inset(0 ${100 - projectReveal}% 0 0)` }} />}
                  {project.interaction === "cellular" && <div className={styles.cellularState} style={{ clipPath: `inset(0 ${100 - projectReveal}% 0 0)` }}><Image src="/images/cellular-compare-with.webp" alt="Room with Cellular Shades" fill sizes="100vw" /></div>}
                  {(project.interaction === "roller" || project.interaction === "combined") && <div className={styles.caseRollers} aria-hidden="true"><i /><i /><i /><i /></div>}
                  {project.interaction === "drapery" && <div className={styles.caseDrapes} aria-hidden="true"><i /><i /></div>}
                  {project.interaction === "combined" && <div className={styles.combinedFilm} aria-hidden="true" />}
                  <div className={styles.caseHeroShade} />
                  <button className={styles.caseBack} type="button" onClick={() => setSelectedProject(null)} aria-label="Return to all featured projects">&#8592; ALL PROJECTS</button>
                  <div className={styles.caseHeroCopy}><span>{project.category} · {project.location}</span><h2>{project.name}</h2><p>{project.title}</p></div>
                  {(project.interaction === "film" || project.interaction === "cellular") && <label className={styles.caseSlider}><span>{project.interaction === "film" ? "CLEAR" : "WITHOUT"}</span><input type="range" min="8" max="92" value={projectReveal} onChange={(event) => setProjectReveal(Number(event.target.value))} aria-label={`Compare ${project.category} transformation`} /><span>{project.interaction === "film" ? "PRIVATE" : "WITH"}</span></label>}
                  {(project.interaction === "roller" || project.interaction === "drapery" || project.interaction === "combined") && <span className={styles.interactionHint}>HOVER TO EXPERIENCE THE TRANSFORMATION</span>}
                </div>

                <div className={styles.caseDetails}>
                  <div className={styles.caseOverview}><span className={styles.kicker}>PROJECT OVERVIEW</span><h3>{project.title}</h3><p>{project.overview}</p></div>
                  <div className={styles.caseSpecs}><div><small>PRODUCTS INSTALLED</small>{project.products.map((item) => <span key={item}>✓ {item}</span>)}</div><div><small>BENEFITS DELIVERED</small>{project.benefits.map((item) => <span key={item}>✓ {item}</span>)}</div></div>
                </div>

                <blockquote className={styles.caseQuote}><span>CLIENT OBJECTIVE</span><p>“{project.goal}”</p></blockquote>

                <div className={styles.caseGallery}>{project.gallery.map((image, index) => <motion.div key={image} whileHover={{ scale: .995 }}><Image src={image} alt={`${project.name} project detail ${index + 1}`} fill sizes="(max-width: 760px) 100vw, 33vw" /></motion.div>)}</div>

                <div className={styles.caseNavigation}>
                  <button type="button" onClick={() => { setProjectReveal(52); setSelectedProject((selectedProject - 1 + projects.length) % projects.length); }}>&#8592; PREVIOUS PROJECT</button>
                  <a className="button button-gold" href="/#contact">CREATE A SIMILAR PROJECT</a>
                  <button type="button" onClick={() => { setProjectReveal(52); setSelectedProject((selectedProject + 1) % projects.length); }}>NEXT PROJECT &#8594;</button>
                </div>
              </motion.article>
            );
          })()}
        </AnimatePresence>
      </section>

      <section className={styles.finalCta}>
        <div><h2>Not sure which solution<br />is right for your space?</h2><p>Schedule a design consultation and our experts will recommend the ideal combination of privacy, light control, comfort, and design for your project.</p><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a></div>
      </section>

      <SiteFooter />
    </main>
  );
}
