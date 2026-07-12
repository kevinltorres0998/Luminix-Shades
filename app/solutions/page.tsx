"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import styles from "./solutions.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) {
  return <NextImage {...props} unoptimized />;
}

function Fade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function Reveal({ children, className }: { children: React.ReactNode; className: string }) {
  return <motion.div className={className} initial={{ clipPath: "inset(0 0 12% 0)", opacity: .72, scale: 1.015 }} whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1, scale: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export default function SolutionsPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 58]);

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <motion.div className={styles.heroMedia} style={{ y: heroY }}><Image src="/images/about-hospitality.png" alt="Luxury interior with layered motorized shades and drapery" fill priority sizes="100vw" /></motion.div>
        <div className={styles.heroShade} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <span className={styles.kicker}>LUMINIX SOLUTIONS</span>
          <h1>Every layer of light.<br /><em>Precisely considered.</em></h1>
          <p>Smart film, motorized shades, and custom drapery designed as part of the architecture—not added after it.</p>
        </motion.div>
        <nav className={styles.heroIndex} aria-label="Solutions on this page"><a href="#smart-film">Smart Film</a><a href="#motorized">Motorized Shades</a><a href="#drapery">Custom Drapery</a></nav>
      </section>

      <section className={styles.perspective}>
        <Fade className={styles.perspectiveTitle}><span className={styles.kicker}>A COMPLETE APPROACH</span><h2>One vision.<br />Multiple layers of control.</h2></Fade>
        <Fade className={styles.perspectiveCopy}><p>Every opening affects privacy, comfort, energy, and atmosphere. We consider those needs together, then shape the right combination of technology, material, and movement.</p><a href="/#contact">DISCUSS YOUR PROJECT <span aria-hidden="true">→</span></a></Fade>
      </section>

      <section className={`${styles.smartFilm} ${styles.solutionSection}`} id="smart-film">
        <Reveal className={styles.smartFilmImage}><Image src="/images/about-smart-film-detail.png" alt="Smart film transitioning from clear to private" fill sizes="(max-width: 900px) 100vw, 62vw" /></Reveal>
        <Fade className={styles.smartFilmCopy}>
          <span className={styles.solutionNumber}>01</span><span className={styles.kicker}>SMART FILM</span>
          <h2>Privacy changes.<br />The architecture doesn&apos;t.</h2>
          <p>Switchable film transforms glass from transparent to private in an instant, preserving clean lines while adding intelligent control.</p>
          <ul><li>Instant privacy</li><li>Minimal visual impact</li><li>Smart automation ready</li><li>Residential & commercial</li></ul>
          <a href="/#contact">EXPLORE SMART FILM <span aria-hidden="true">→</span></a>
        </Fade>
      </section>

      <section className={`${styles.motorized} ${styles.solutionSection}`} id="motorized">
        <Fade className={styles.motorizedCopy}>
          <span className={styles.solutionNumber}>02</span><span className={styles.kicker}>MOTORIZED SHADES</span>
          <h2>Light control that<br /><em>moves with you.</em></h2>
          <p>Quiet motors, tailored fabrics, and discreet integration create effortless control throughout the day.</p>
          <div className={styles.specLine}><span>Blackout</span><span>Screen</span><span>Translucent</span><span>Automated</span></div>
          <a href="/#contact">EXPLORE MOTORIZED SHADES <span aria-hidden="true">→</span></a>
        </Fade>
        <div className={styles.motorizedVisual}>
          <Reveal className={styles.motorizedRoom}><Image src="/images/hero.png" alt="Motorized shades in a Miami waterfront residence" fill sizes="(max-width: 900px) 100vw, 58vw" /></Reveal>
          <motion.div className={styles.motorDetail} initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .8, delay: .2, ease: [0.22, 1, 0.36, 1] }}><Image src="/images/about-motor-detail.png" alt="Concealed motorized shade mechanism" fill sizes="280px" /></motion.div>
        </div>
      </section>

      <section className={`${styles.drapery} ${styles.solutionSection}`} id="drapery">
        <Reveal className={styles.draperyImage}><Image src="/images/about-fabric-detail.png" alt="Premium custom drapery fabrics" fill sizes="(max-width: 900px) 100vw, 52vw" /></Reveal>
        <Fade className={styles.draperyCopy}>
          <span className={styles.solutionNumber}>03</span><span className={styles.kicker}>CUSTOM DRAPERY</span>
          <h2>Material, proportion,<br /><em>and the perfect fall.</em></h2>
          <p>Bespoke drapery brings softness, scale, and acoustic comfort to the architecture through carefully selected fabric and exact fabrication.</p>
          <div className={styles.fabricList}><span>Sheer</span><span>Linen</span><span>Velvet</span><span>Blackout</span><span>Custom Hardware</span></div>
          <a href="/#contact">EXPLORE CUSTOM DRAPERY <span aria-hidden="true">→</span></a>
        </Fade>
      </section>

      <section className={styles.applications}>
        <Fade className={styles.applicationsHeading}><span className={styles.kicker}>DESIGNED FOR EVERY SCALE</span><h2>From private retreat<br />to public experience.</h2></Fade>
        <div className={styles.applicationGrid}>
          <article id="residential"><Image src="/images/residential.png" alt="Luxury South Florida residence" fill sizes="(max-width: 900px) 100vw, 50vw" /><div><span>RESIDENTIAL</span><h3>Comfort, privacy, and atmosphere—designed around daily life.</h3><a href="/#contact">EXPLORE RESIDENTIAL →</a></div></article>
          <article id="commercial"><Image src="/images/commercial.png" alt="Refined commercial interior" fill sizes="(max-width: 900px) 100vw, 50vw" /><div><span>COMMERCIAL</span><h3>Reliable, scalable systems for hospitality, workplace, and development.</h3><a href="/#contact">EXPLORE COMMERCIAL →</a></div></article>
        </div>
      </section>

      <section className={styles.overview}>
        <Fade className={styles.overviewTitle}><span className={styles.kicker}>FIND THE RIGHT LAYER</span><h2>Different needs.<br />One considered system.</h2></Fade>
        <div className={styles.matrix}>
          <div className={styles.matrixHead}><span>Solution</span><span>Privacy</span><span>Light Control</span><span>Automation</span><span>Design Impact</span></div>
          {["Smart Film", "Motorized Shades", "Custom Drapery"].map((name, i) => <div className={styles.matrixRow} key={name}><b>{name}</b><span>{["Instant", "Variable", "Layered"][i]}</span><span>{["Clear / Private", "Precise", "Softened"][i]}</span><span>{["Integrated", "Advanced", "Optional"][i]}</span><span>{["Minimal", "Architectural", "Expressive"][i]}</span></div>)}
        </div>
      </section>

      <section className={styles.integration}>
        <Fade><span className={styles.kicker}>INTELLIGENT INTEGRATION</span><h2>Technology should feel present<br />only when you need it.</h2><p>We work with trusted control platforms and proven systems to create smooth, reliable performance across every opening.</p></Fade>
        <div className={styles.partnerNames}><b>somfy.</b><b>LUTRON.</b><b>SMARTTINT®</b><b className={styles.serif}>ALTA</b><b>mecho</b></div>
      </section>

      <section className={styles.finalSection}>
        <div className={styles.finalPanel}><span className={styles.kicker}>BEGIN WITH THE SPACE</span><h2>Let&apos;s design the right layers<br /><em>for the way you live and work.</em></h2><p>Tell us about your project, and we&apos;ll help shape a solution around its architecture, light, and purpose.</p><div><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="mailto:hello@luminixshades.com">CONTACT OUR TEAM</a></div></div>
      </section>

      <SiteFooter />
    </main>
  );
}
