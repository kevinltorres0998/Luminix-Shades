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
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

const benefits = [
  ["Instant Privacy", "Transform glass from transparent to private in a moment."],
  ["Minimal Design", "Preserve clean sightlines without shades, tracks, or visual clutter."],
  ["Smart Integration", "Control with a switch, remote, app, or automation system."],
  ["Light & UV Control", "Diffuse glare and help protect refined interiors from UV exposure."],
];

const steps = [
  ["01", "Apply", "Precision-installed film is tailored directly to the existing glass."],
  ["02", "Connect", "Discreet electrical components are integrated into the architecture."],
  ["03", "Control", "Privacy responds instantly through your preferred control system."],
];

export default function SmartFilmPage() {
  const [privacyLevel, setPrivacyLevel] = useState(54);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 720], [0, 62]);

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <motion.div className={styles.heroMedia} style={{ y: heroY }}><Image src="/images/about-smart-film-detail.png" alt="Smart film integrated into a refined glass conference room" fill priority sizes="100vw" /></motion.div>
        <div className={styles.heroShade} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <span className={styles.kicker}>SMART FILM</span>
          <h1>Privacy, on demand.<br /><em>Architecture, uninterrupted.</em></h1>
          <p>Switchable privacy glass that moves effortlessly between openness and discretion—without compromising the design of the space.</p>
          <div className={styles.heroActions}><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="#experience">SEE IT IN ACTION</a></div>
        </motion.div>
        <span className={styles.scrollCue}>DISCOVER SMART FILM <i aria-hidden="true" /></span>
      </section>

      <section className={styles.intro}>
        <Fade className={styles.introLead}><span className={styles.kicker}>A NEW RELATIONSHIP WITH GLASS</span><h2>Glass when open.<br /><em>Privacy when needed.</em></h2></Fade>
        <Fade className={styles.introCopy}><p>Smart film gives architectural glass a second state. With one touch, transparent surfaces become softly opaque—creating privacy without adding visual weight.</p><p>It is a precise solution for interiors where flexibility, clean design, and intelligent control belong together.</p></Fade>
      </section>

      <section className={styles.experience} id="experience">
        <Fade className={styles.experienceHeading}><span className={styles.kicker}>EXPERIENCE THE TRANSFORMATION</span><h2>Move between clear<br />and private.</h2><p>Drag the control to experience how the glass responds to the needs of the space.</p></Fade>
        <motion.div className={styles.demo} initial={{ opacity: 0, scale: 1.015 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .18 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <Image src="/images/smart-film.png" alt="Waterfront room demonstrating clear and private smart film" fill sizes="100vw" />
          <div className={styles.frosted} style={{ width: `${privacyLevel}%` }} />
          <div className={styles.handle} style={{ left: `${privacyLevel}%` }} aria-hidden="true"><span>‹</span><span>›</span></div>
          <span className={`${styles.demoLabel} ${styles.privateLabel}`}>PRIVATE</span><span className={`${styles.demoLabel} ${styles.clearLabel}`}>CLEAR</span>
          <input type="range" min="12" max="88" value={privacyLevel} onChange={(event) => setPrivacyLevel(Number(event.target.value))} aria-label="Adjust the smart film privacy level" />
        </motion.div>
      </section>

      <section className={styles.benefits}>
        <Fade className={styles.benefitsHeading}><span className={styles.kicker}>BEAUTY IN BOTH STATES</span><h2>Technology that<br />disappears into the design.</h2></Fade>
        <div className={styles.benefitGrid}>{benefits.map(([title, copy], index) => <Fade className={styles.benefit} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></Fade>)}</div>
      </section>

      <section className={styles.applications}>
        <Fade className={styles.applicationIntro}><span className={styles.kicker}>DESIGNED FOR THE WAY SPACES CHANGE</span><h2>One technology.<br />Distinct possibilities.</h2></Fade>
        <div className={styles.applicationGrid}>
          <motion.a href="/solutions#residential" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .8 }}><Image src="/images/residential.png" alt="Smart film in a luxury residence" fill sizes="(max-width: 900px) 100vw, 50vw" /><div><span>RESIDENTIAL</span><h3>Privacy that appears only when you want it.</h3><p>Bathrooms, bedrooms, entryways, and glass partitions.</p><b>EXPLORE RESIDENTIAL →</b></div></motion.a>
          <motion.a href="/solutions#commercial" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .8, delay: .08 }}><Image src="/images/commercial.png" alt="Smart film in a premium commercial interior" fill sizes="(max-width: 900px) 100vw, 50vw" /><div><span>COMMERCIAL</span><h3>Flexible privacy for spaces that perform.</h3><p>Offices, conference rooms, hospitality, healthcare, and retail.</p><b>EXPLORE COMMERCIAL →</b></div></motion.a>
        </div>
      </section>

      <section className={styles.process}>
        <Fade className={styles.processIntro}><span className={styles.kicker}>HOW IT WORKS</span><h2>Precisely integrated.<br />Effortless to use.</h2><p>From field measurement to final programming, every detail is considered as part of the finished environment.</p></Fade>
        <div className={styles.stepGrid}>{steps.map(([number, title, copy]) => <Fade className={styles.step} key={title}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></Fade>)}</div>
      </section>

      <section className={styles.integration}>
        <div className={styles.integrationImage}><Image src="/images/about-motor-detail.png" alt="Discreet smart home control integrated into an interior" fill sizes="(max-width: 900px) 100vw, 52vw" /></div>
        <Fade className={styles.integrationCopy}><span className={styles.kicker}>INTELLIGENT BY DESIGN</span><h2>Privacy, connected<br />to your environment.</h2><p>Smart film can operate independently or become part of a complete automation system—coordinated with lighting, shading, scenes, and daily routines.</p><ul><li>Wall switch and remote control</li><li>Mobile and voice control</li><li>Smart home and building integration</li><li>Scheduled scenes and automation</li></ul><span className={styles.partnerMark}>SMARTTINT® <i>technology partner</i></span></Fade>
      </section>

      <section className={styles.finalSection}>
        <div className={styles.finalPanel}><span className={styles.kicker}>BEGIN WITH THE GLASS</span><h2>Imagine what your space<br /><em>could become.</em></h2><p>Let&apos;s explore how switchable privacy can become a seamless part of your architecture.</p><div><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="mailto:hello@luminixshades.com">DISCUSS YOUR PROJECT</a></div></div>
      </section>

      <SiteFooter />
    </main>
  );
}
