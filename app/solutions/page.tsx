"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import { useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import styles from "./solutions.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) {
  return <NextImage {...props} unoptimized />;
}

function Fade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

const featured = [
  { id: "smart-film", name: "Smart Film", bestFor: "Instant Privacy", copy: "Switchable privacy glass that transforms instantly while preserving clean architectural design.", image: "/images/about-smart-film-detail.png", href: "/solutions/smart-film" },
  { id: "motorized", name: "Motorized Shades", bestFor: "Everyday Automation", copy: "Quiet automation designed for effortless daily comfort and precise light control.", image: "/images/hero.png", href: "/solutions/roller-shades" },
  { id: "drapery", name: "Custom Drapery", bestFor: "Warmth & Texture", copy: "Layered softness, texture, and craftsmanship tailored to every interior.", image: "/images/about-fabric-detail.png", href: "/#drapery" },
];

export default function SolutionsPage() {
  const [activeSelection, setActiveSelection] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 58]);

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <motion.div className={styles.heroMedia} style={{ y: heroY }}><Image src="/images/about-hospitality.png" alt="Layered window solutions in a luxury interior" fill priority sizes="100vw" /></motion.div>
        <div className={styles.heroShade} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <span className={styles.kicker}>LUMINIX SOLUTIONS</span>
          <h1>Window Solutions.<br /><em>Designed around light.</em></h1>
          <p>Intelligent privacy, precise light control, and tailored materials—considered as part of the architecture.</p>
          <a className="button button-gold" href="#featured">EXPLORE OUR SOLUTIONS</a>
        </motion.div>
      </section>

      <section className={styles.featured} id="featured">
        <Fade className={styles.featuredHeading}><span className={styles.kicker}>FEATURED SOLUTIONS</span><h2>Three ways to shape<br />how a space feels.</h2></Fade>
        <div className={styles.featuredList}>
          {featured.map((item, index) => (
            <motion.article className={styles.solutionPanel} id={item.id} key={item.name} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}>
              <Image src={item.image} alt={item.name} fill sizes="100vw" />
              <div className={styles.panelShade} />
              <div className={styles.panelCopy}><span>0{index + 1}</span><h3>{item.name}</h3><p>{item.copy}</p><a href={item.href}>EXPLORE {item.name.toUpperCase()} <b aria-hidden="true">→</b></a></div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.chooser}>
        <Fade className={styles.chooserTitle}><span className={styles.kicker}>CHOOSING THE RIGHT SOLUTION</span><h2>A simple place<br />to begin.</h2></Fade>
        <div className={styles.selectionStage}>
          <nav className={styles.selectionList} aria-label="Choose a solution">
            {featured.map((item, index) => <a className={activeSelection === index ? styles.activeSelection : ""} href={item.href} key={item.name} onMouseEnter={() => setActiveSelection(index)} onFocus={() => setActiveSelection(index)}><span>{item.name}</span><small>{item.bestFor}</small><i aria-hidden="true">→</i></a>)}
          </nav>
          <div className={styles.selectionVisual}>
            <motion.div key={featured[activeSelection].image} initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>
              <Image src={featured[activeSelection].image} alt={featured[activeSelection].name} fill sizes="(max-width: 900px) 100vw, 55vw" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className={styles.applications}>
        <Fade className={styles.applicationsHeading}><span className={styles.kicker}>DESIGNED FOR EVERY SCALE</span><h2>Residential & Commercial</h2></Fade>
        <div className={styles.applicationGrid}>
          <article id="residential"><Image src="/images/residential.png" alt="Luxury South Florida residence" fill sizes="(max-width: 900px) 100vw, 50vw" /><div><span>RESIDENTIAL</span><h3>Comfort and atmosphere, designed around daily life.</h3><a href="/#residential">EXPLORE RESIDENTIAL →</a></div></article>
          <article id="commercial"><Image src="/images/commercial.png" alt="Refined commercial interior" fill sizes="(max-width: 900px) 100vw, 50vw" /><div><span>COMMERCIAL</span><h3>Scalable systems for hospitality, workplace, and development.</h3><a href="/#commercial">EXPLORE COMMERCIAL →</a></div></article>
        </div>
      </section>

      <section className={styles.partners}>
        <Fade className={styles.partnersIntro}><span className={styles.kicker}>TRUSTED TECHNOLOGY PARTNERS</span><p>Proven systems selected for performance, reliability, and refined integration.</p></Fade>
        <div className={styles.partnerNames}><b>somfy.</b><b>LUTRON.</b><b>SMARTTINT®</b><b className={styles.serif}>ALTA</b><b>mecho</b></div>
      </section>

      <section className={styles.finalSection}>
        <div className={styles.finalPanel}><span className={styles.kicker}>BEGIN WITH THE SPACE</span><h2>Let&apos;s design the right solution<br /><em>for your space.</em></h2><p>A considered project begins with a conversation about light, privacy, and how you want the environment to feel.</p><div><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="mailto:hello@luminixshades.com">CONTACT OUR TEAM</a></div></div>
      </section>

      <SiteFooter />
    </main>
  );
}
