"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import { useState } from "react";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import styles from "./smart-film.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) {
  return <NextImage {...props} unoptimized />;
}

function Fade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function GlassPanels({ variant }: { variant: "total" | "light" | "black" }) {
  return <div className={`${styles.cardGlass} ${styles[variant]}`} aria-hidden="true"><i /><i /><i /></div>;
}

function BenefitIcon({ type }: { type: string }) {
  return <span className={`${styles.benefitIcon} ${styles[type]}`} aria-hidden="true"><i /><b /><em /></span>;
}

const filmTypes = [
  { variant: "total" as const, title: "Smart Film Total", copy: "Complete privacy. Full opacity for maximum discretion.", cta: "EXPLORE TOTAL", featured: true },
  { variant: "light" as const, title: "Smart Film Light", copy: "Balanced privacy. Natural light with enhanced discretion.", cta: "EXPLORE LIGHT", featured: false },
  { variant: "black" as const, title: "Smart Film Black", copy: "Maximum privacy and light control with a dark, elegant finish.", cta: "EXPLORE BLACK", featured: false },
];

const benefits = [
  ["Instant Privacy", "Transform glass from transparent to private in a moment.", "privacyIcon"],
  ["Minimal Design", "Preserve clean sightlines without shades, tracks, or visual clutter.", "minimalIcon"],
  ["Smart Integration", "Control with a switch, remote, app, or automation system.", "smartIcon"],
  ["Light & UV Control", "Diffuse glare and help protect refined interiors from harmful UV.", "lightIcon"],
];

export default function SmartFilmPage() {
  const [divider, setDivider] = useState(50);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 50]);

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <motion.div className={styles.heroMedia} style={{ y: heroY }}><Image src="/images/smart-film-hero-v2.png" alt="Premium glass conference room designed for switchable privacy film" fill priority sizes="100vw" /></motion.div>
        <div className={styles.heroShade} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .95, ease: [0.22, 1, 0.36, 1] }}>
          <span className={styles.kicker}>SMART FILM</span>
          <h1>Privacy, on demand.<br /><em>Architecture,<br />uninterrupted.</em></h1>
          <p>Switchable privacy glass that moves effortlessly between openness and discretion—without compromising the design of the space.</p>
          <div><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="#transformation">SEE IT IN ACTION</a></div>
        </motion.div>
        <a className={styles.heroCue} href="#transformation" aria-label="View Smart Film transformation">⌄</a>
      </section>

      <section className={styles.transformation} id="transformation">
        <Fade className={styles.transformHeading}><div><span className={styles.kicker}>EXPERIENCE THE TRANSFORMATION</span><h2>One room.<br />Two precise states.</h2></div><p>Drag to switch the glass from clear to private.</p></Fade>
        <motion.div className={styles.comparison} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}>
          <Image src="/images/smart-film-demo-clear.png" alt="Clear glass conference room with interactive Smart Film privacy comparison" fill sizes="100vw" />
          <div className={styles.privateState} style={{ clipPath: `inset(0 0 0 ${divider}%)` }} aria-hidden="true"><i /><i /><i /></div>
          <span className={`${styles.stateLabel} ${styles.clearLabel}`}>CLEAR</span><span className={`${styles.stateLabel} ${styles.privateLabel}`}>PRIVATE</span>
          <span className={styles.divider} style={{ left: `${divider}%` }} aria-hidden="true"><i>‹</i><i>›</i></span>
          <input type="range" min="14" max="86" value={divider} onChange={(event) => setDivider(Number(event.target.value))} aria-label="Drag to switch the glass from clear to private" />
        </motion.div>
      </section>

      <section className={styles.filmSection} id="film-types">
        <Fade className={styles.filmIntro}><span className={styles.kicker}>THREE SMART FILM SOLUTIONS</span><h2>The right level of privacy<br />for every space.</h2></Fade>
        <div className={styles.filmGrid}>
          {filmTypes.map((film, index) => <motion.a className={styles.filmCard} href="mailto:hello@luminixshades.com?subject=Smart%20Film%20Consultation" key={film.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .72, delay: index * .06 }}>
            <div className={styles.filmVisual}><Image src="/images/smart-film-demo-clear.png" alt={`${film.title} privacy finish`} fill sizes="(max-width: 900px) 100vw, 29vw" /><GlassPanels variant={film.variant} />{film.featured && <span>MOST POPULAR</span>}</div>
            <div className={styles.filmCopy}><h3>{film.title}</h3><p>{film.copy}</p><b>{film.cta} <i>→</i></b></div>
          </motion.a>)}
        </div>
      </section>

      <section className={styles.benefits}>
        <Fade className={styles.benefitIntro}><span className={styles.kicker}>BEAUTY IN BOTH STATES</span><h2>Technology that<br />disappears into the design.</h2></Fade>
        <div className={styles.benefitGrid}>{benefits.map(([title, copy, icon], index) => <Fade className={styles.benefit} key={title}><BenefitIcon type={icon} /><h3>{title}</h3><p>{copy}</p><span>0{index + 1}</span></Fade>)}</div>
      </section>

      <section className={styles.useCases}>
        <span className={styles.kicker}>DESIGNED FOR EVERY SPACE</span>
        <div className={styles.useGrid}>
          <motion.a href="mailto:hello@luminixshades.com?subject=Residential%20Smart%20Film" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }}><div className={styles.useCopy}><h2>Residential</h2><p>Bathrooms, bedrooms, entryways, and interior glass partitions.</p><b>EXPLORE RESIDENTIAL <i>→</i></b></div><div className={styles.useImage}><Image src="/images/about-smart-film-detail.png" alt="Residential Smart Film on an interior glass partition" fill sizes="(max-width: 900px) 100vw, 33vw" /></div></motion.a>
          <motion.a href="mailto:hello@luminixshades.com?subject=Commercial%20Smart%20Film" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ delay: .08 }}><div className={styles.useCopy}><h2>Commercial</h2><p>Offices, conference rooms, hospitality, healthcare, and retail spaces.</p><b>EXPLORE COMMERCIAL <i>→</i></b></div><div className={styles.useImage}><Image src="/images/smart-film-control-detail.png" alt="Commercial Smart Film glass partition and control" fill sizes="(max-width: 900px) 100vw, 33vw" /></div></motion.a>
        </div>
      </section>

      <section className={styles.finalCta} id="contact">
        <Fade className={styles.finalTitle}><span className={styles.kicker}>LET&apos;S DESIGN THE RIGHT SOLUTION</span><h2>See what your glass<br />can become.</h2></Fade>
        <Fade className={styles.finalCopy}><p>Tell us about the space, the glass, and the level of privacy you need. We&apos;ll help determine the right Smart Film solution.</p><div><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="mailto:hello@luminixshades.com?subject=Smart%20Film%20Technical%20Information">REQUEST TECHNICAL INFORMATION</a></div></Fade>
      </section>

      <SiteFooter />
    </main>
  );
}
