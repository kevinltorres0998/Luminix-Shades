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
  ["Miami Waterfront", "Smart Film", "Miami Beach", "/images/smart-film.png"],
  ["Brickell Residence", "Motorized Roller Shades", "Brickell", "/images/hero.png"],
  ["Coral Gables Home", "Custom Drapery", "Coral Gables", "/images/drapery-room-linen.png"],
  ["Quiet Primary Suite", "Cellular Shades", "Coconut Grove", "/images/cellular-hero-winter.webp"],
  ["Downtown Workplace", "Smart Film + Shades", "Downtown Miami", "/images/commercial.png"],
];

export default function SolutionsPage() {
  const [category, setCategory] = useState(0);
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
        <Fade className={styles.projectsIntro}><span className={styles.kicker}>FEATURED PROJECTS</span><h2>Inspired by<br />real spaces.</h2><p>See how our solutions transform architecture into elevated experiences.</p></Fade>
        <div className={styles.projectGrid}>{projects.map(([name, product, location, image]) => <motion.article key={name} whileHover={{ y: -4 }}><Image src={image} alt={`${name} featuring ${product}`} fill sizes="(max-width: 760px) 100vw, 19vw" /><div><h3>{name}</h3><p>{product}</p><span>{location}</span></div></motion.article>)}</div>
      </section>

      <section className={styles.finalCta}>
        <div><h2>Not sure which solution<br />is right for your space?</h2><p>Schedule a design consultation and our experts will recommend the ideal combination of privacy, light control, comfort, and design for your project.</p><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a></div>
      </section>

      <SiteFooter />
    </main>
  );
}
