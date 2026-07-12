"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import { useState } from "react";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import styles from "./roller-shades.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) { return <NextImage {...props} unoptimized />; }
function Fade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .78, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

const fabrics = {
  blackout: { label: "Blackout", note: "Maximum privacy · Near-total light control" },
  screen: { label: "Screen", note: "Filtered daylight · Preserved view" },
  translucent: { label: "Translucent", note: "Soft glow · Refined privacy" },
} as const;
type Fabric = keyof typeof fabrics;

const spaces = [
  ["Living Room", "Comfort & elegance", "/images/hero.png"],
  ["Bedroom", "Rest & relaxation", "/images/about-hospitality.png"],
  ["Office", "Focus & productivity", "/images/commercial-smart-film-cover-v3.png"],
  ["Commercial", "Performance & style", "/images/commercial.png"],
];
const projects = [
  ["Miami Beach", "Screen Roller Shades", "/images/hero.png"],
  ["Brickell, Miami", "Blackout Roller Shades", "/images/about-hospitality.png"],
  ["Coconut Grove", "Translucent Roller Shades", "/images/residential.png"],
  ["Downtown Miami", "Custom Solar Shades", "/images/commercial.png"],
];

export default function RollerShadesPage() {
  const [fabric, setFabric] = useState<Fabric>("screen");
  const [fabricSequence, setFabricSequence] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 760], [0, 54]);

  return <main className={styles.page}>
    <SiteHeader />

    <section className={styles.hero} id="top">
      <motion.div className={styles.heroMedia} style={{ y: heroY }}><Image src="/images/hero.png" alt="Luxury Miami residence with partially lowered motorized roller shades" fill priority loading="eager" sizes="100vw" /></motion.div>
      <div className={styles.heroShade} />
      <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .95, ease: [0.22, 1, 0.36, 1] }}>
        <span className={styles.kicker}>ROLLER SHADES</span>
        <h1>Light,<br /><em>perfectly<br />controlled.</em></h1>
        <p>Custom motorized roller shades designed to balance privacy, daylight, and modern architecture.</p>
        <div><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="#fabrics">EXPLORE FABRICS</a></div>
      </motion.div>
    </section>

    <section className={styles.moment}>
      <Fade className={styles.momentCopy}><span className={styles.kicker}>EFFORTLESS LIGHT CONTROL</span><h2>The perfect shade<br />for every moment.</h2><p>From soft natural light to total blackout, every shade moves quietly and precisely—responding to the way you live.</p></Fade>
      <Fade className={styles.motionStage}><Image src="/images/roller-shades-demo-room.png" alt="Miami living room prepared for motorized roller shade demonstration" fill sizes="(max-width: 900px) 100vw, 62vw" /><div className={styles.animatedShades} aria-hidden="true"><i /><i /><i /><i /></div><span className={styles.motionLabel}>AUTOMATED LIGHT CONTROL</span></Fade>
    </section>

    <section className={styles.possibilities}>
      <Fade className={styles.sectionHeading}><span className={styles.kicker}>SOLUTIONS FOR EVERY NEED</span><h2>One window.<br />Endless possibilities.</h2></Fade>
      <div className={styles.solutionGrid}>
        <Fade className={`${styles.solutionCard} ${styles.blackoutCard}`}><Image src="/images/about-hospitality.png" alt="Blackout roller shades in a luxury bedroom" fill sizes="(max-width: 700px) 100vw, 31vw" /><div><h3>Blackout</h3><p>Perfect darkness for restful sleep and complete privacy.</p><a href="#fabrics">DISCOVER BLACKOUT <span>→</span></a></div></Fade>
        <Fade className={`${styles.solutionCard} ${styles.screenCard}`}><Image src="/images/hero.png" alt="Screen roller shades preserving a Miami waterfront view" fill sizes="(max-width: 700px) 100vw, 31vw" /><div><h3>Screen</h3><p>Maximum daylight. Reduced glare. Outdoor views preserved.</p><a href="#fabrics">DISCOVER SCREEN <span>→</span></a></div></Fade>
        <Fade className={`${styles.solutionCard} ${styles.translucentCard}`}><Image src="/images/roller-shades-demo-room.png" alt="Translucent roller shades creating a warm natural glow" fill sizes="(max-width: 700px) 100vw, 31vw" /><div><h3>Translucent</h3><p>Soft natural light with elegant daytime privacy.</p><a href="#fabrics">DISCOVER TRANSLUCENT <span>→</span></a></div></Fade>
      </div>
    </section>

    <section className={styles.showroom} id="fabrics">
      <Fade className={styles.showroomCopy}><span className={styles.kicker}>EXPERIENCE THE DIFFERENCE</span><h2>Compare fabrics.</h2><p>See how each fabric transforms light, view, and privacy in the same space.</p><small>Select a finish to see it in action.</small></Fade>
      <Fade className={styles.showroomStage}>
        <Image src="/images/roller-shades-demo-room.png" alt="Interactive Roller Shade fabric showroom" fill sizes="(max-width: 900px) 100vw, 68vw" />
        <motion.div key={`${fabric}-${fabricSequence}-mood`} className={`${styles.roomMood} ${styles[`${fabric}Mood`]}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.05, ease: [0.45, 0, 0.18, 1] }} aria-hidden="true" />
        <div key={`${fabric}-${fabricSequence}`} className={`${styles.fabricLayer} ${styles[fabric]}`} aria-hidden="true">{[0,1,2,3].map((index) => <motion.i key={index} initial={{ scaleY: .025 }} animate={{ scaleY: 1 }} transition={{ duration: 1.85, delay: index * .1, ease: [0.65, 0, 0.35, 1] }} />)}</div>
        <div className={styles.hardwareLayer} aria-hidden="true">{[0,1,2,3].map((index) => <i key={index} />)}</div>
        <div className={styles.fabricTabs}>{(Object.keys(fabrics) as Fabric[]).map((key) => <button type="button" key={key} className={fabric === key ? styles.activeFabric : ""} aria-pressed={fabric === key} onClick={() => { setFabric(key); setFabricSequence((sequence) => sequence + 1); }}>{fabrics[key].label}</button>)}</div>
        <motion.div key={`${fabric}-note`} className={styles.fabricNote} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{fabrics[fabric].note}</motion.div>
      </Fade>
    </section>

    <section className={styles.motorization}>
      <Fade className={styles.motorCopy}><span className={styles.kicker}>SMART CONTROL</span><h2>Motorization.</h2><p>Control every shade with a remote, wall switch, smartphone, or your favorite smart home system.</p><a className="button button-gold" href="/#contact">DISCOVER MOTORIZATION</a></Fade>
      <div className={styles.remoteWrap} aria-hidden="true"><motion.div className={styles.remote} initial={{ opacity: 0, rotate: -18, y: 24 }} whileInView={{ opacity: 1, rotate: -13, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}><span>○</span><b>⌃</b><b>●</b><b>⌄</b><i>LUMINIX<br />SHADES</i></motion.div></div>
      <div className={styles.integrations}>{["Apple Home","Google Home","Alexa","Control4","Crestron","Lutron"].map((name, i) => <Fade className={styles.integration} key={name}><span aria-hidden="true">{["⌂","△","◯","◌","◎","✺"][i]}</span><b>{name}</b></Fade>)}</div>
    </section>

    <section className={styles.spaces}>
      <Fade className={styles.spacesIntro}><span className={styles.kicker}>CRAFTED FOR EVERY SPACE</span><h2>Designed for how<br />you live and work.</h2><p>Tailored light-control solutions for residential and commercial interiors.</p></Fade>
      <div className={styles.spaceGrid}>{spaces.map(([title, note, image]) => <motion.article key={title} whileHover={{ y: -3 }}><Image src={image} alt={`${title} with custom roller shades`} fill sizes="(max-width: 800px) 100vw, 21vw" /><div><h3>{title}</h3><p>{note}</p><span>↗</span></div></motion.article>)}</div>
    </section>

    <section className={styles.details}>
      <Fade className={styles.detailsTitle}><span className={styles.kicker}>QUALITY IN EVERY DETAIL</span><h2>Details make<br />the difference.</h2></Fade>
      <div className={styles.detailGrid}>{[["▭","Minimal Cassette"],["◉","Silent Motors"],["◇","Premium Fabrics"],["☼","UV Protection"],["⌑","Custom Made"]].map(([icon,title]) => <Fade className={styles.detail} key={title}><span>{icon}</span><h3>{title}</h3><p>Precision engineered for quiet, refined performance.</p></Fade>)}</div>
    </section>

    <section className={styles.process}>
      <Fade className={styles.processTitle}><span className={styles.kicker}>OUR PROCESS</span><h2>Seamless from<br />start to finish.</h2></Fade>
      <div className={styles.timeline}>{["Consultation","Measurements","Fabric Selection","Installation","Enjoy"].map((step, i) => <Fade className={styles.timelineStep} key={step}><span>{i + 1}</span><h3>{step}</h3><p>{["We understand your needs and vision.","Precise measurements for a perfect fit.","Choose the ideal fabric for your space.","Professional installation with attention to detail.","Sit back and enjoy perfect light control."][i]}</p></Fade>)}</div>
    </section>

    <section className={styles.projects}>
      <Fade className={styles.projectsTitle}><span className={styles.kicker}>FEATURED PROJECTS</span><h2>Real spaces.<br />Real results.</h2></Fade>
      <div className={styles.projectGrid}>{projects.map(([title,note,image]) => <motion.article key={title} whileHover="hover"><Image src={image} alt={`${title} roller shade project`} fill sizes="(max-width: 800px) 100vw, 22vw" /><motion.div variants={{ hover: { opacity: 1 } }} initial={{ opacity: .75 }}><h3>{title}</h3><p>{note}</p><span>↗</span></motion.div></motion.article>)}</div>
    </section>

    <section className={styles.finalCta}>
      <Image src="/images/residential.png" alt="Miami residence with partially open roller shades at sunset" fill sizes="100vw" />
      <div className={styles.finalShade} />
      <Fade className={styles.finalContent}><span className={styles.kicker}>LET&apos;S CREATE YOUR PERFECT VIEW</span><h2>Designed around your view.</h2><p>Whether you&apos;re furnishing a luxury residence or a commercial space, we&apos;ll help you find the perfect balance of light, privacy, and design.</p><div><a className="button button-gold" href="/#contact">SCHEDULE CONSULTATION</a><a className="button button-outline" href="/#contact">REQUEST A QUOTE</a></div></Fade>
    </section>

    <SiteFooter />
  </main>;
}
