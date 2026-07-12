"use client";

import { motion } from "framer-motion";
import NextImage from "next/image";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import styles from "./about.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) {
  return <NextImage {...props} unoptimized />;
}

function Fade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const principles = [
  ["Precision", "Every proportion, material, and movement is considered as part of the architecture."],
  ["Discretion", "Technology should feel effortless—present when needed and nearly invisible when not."],
  ["Craft", "Premium materials and exact installation turn functional systems into finished interiors."],
];

const capabilities = [
  ["Residential", "Private residences shaped around comfort, atmosphere, and daily rituals.", "/images/residential.png"],
  ["Commercial", "Scalable solutions for hospitality, workplace, retail, and signature developments.", "/images/commercial.png"],
  ["Design Partners", "A collaborative resource for architects, designers, builders, and contractors.", "/images/architecture.png"],
];

export default function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <Image src="/images/architecture.png" alt="Architectural glass residence at dusk" fill priority sizes="100vw" />
        <div className={styles.heroShade} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <span className={styles.eyebrow}>ABOUT LUMINIX SHADES</span>
          <h1>We design how light<br />is <em>experienced.</em></h1>
          <p>Architectural window solutions where refined design, intelligent technology, and precise craftsmanship work as one.</p>
        </motion.div>
        <span className={styles.scrollCue}>DISCOVER OUR APPROACH <i aria-hidden="true" /></span>
      </section>

      <section className={styles.intro}>
        <Fade className={styles.introCopy}>
          <span className={styles.kicker}>OUR PERSPECTIVE</span>
          <h2>More than window treatments.<br /><em>A study in atmosphere.</em></h2>
          <p className={styles.lead}>Luminix Shades was created around a simple idea: the way light enters a space should be as carefully considered as the space itself.</p>
          <p>We combine technical knowledge with a design-led sensibility to create environments that feel quieter, more comfortable, and completely intentional.</p>
        </Fade>
        <div className={styles.introImage}><Image src="/images/hero.png" alt="Refined Miami residence with controlled natural light" fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
      </section>

      <section className={styles.principles}>
        <Fade className={styles.sectionHeading}>
          <span className={styles.kicker}>WHAT GUIDES US</span>
          <h2>Quiet confidence.<br />Obsessive attention.</h2>
          <p>Our work is defined by restraint, discipline, and an understanding that luxury is felt most clearly in the details.</p>
        </Fade>
        <div className={styles.principleGrid}>
          {principles.map(([title, copy]) => (
            <Fade className={styles.principleCard} key={title}>
              <span className={styles.lineDetail} aria-hidden="true" />
              <h3>{title}</h3><p>{copy}</p>
            </Fade>
          ))}
        </div>
      </section>

      <section className={styles.statement}>
        <Image src="/images/smart-film.png" alt="Miami interior with smart privacy glass" fill sizes="100vw" />
        <div className={styles.statementShade} />
        <Fade className={styles.statementCopy}>
          <span className={styles.kicker}>DESIGN MEETS TECHNOLOGY</span>
          <h2>Innovation should never<br />interrupt the architecture.</h2>
          <p>Our systems are selected and integrated to enhance the experience of a space—not compete with it.</p>
        </Fade>
      </section>

      <section className={styles.story}>
        <div className={styles.storyImage}><Image src="/images/residential.png" alt="Warm contemporary residence in South Florida" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
        <Fade className={styles.storyCopy}>
          <span className={styles.kicker}>BUILT IN SOUTH FLORIDA</span>
          <h2>Local understanding.<br /><em>World-class standards.</em></h2>
          <p>South Florida demands a unique relationship with light, heat, privacy, and expansive glass. Our approach is grounded in that reality and elevated by a global design perspective.</p>
          <p>From waterfront residences to hospitality and commercial environments, every project receives the same level of care, coordination, and finish.</p>
          <div className={styles.storyFacts}>
            <div><b>01</b><span>Design-led consultation</span></div>
            <div><b>02</b><span>Technical specification</span></div>
            <div><b>03</b><span>Precision installation</span></div>
          </div>
        </Fade>
      </section>

      <section className={styles.capabilities}>
        <Fade className={styles.capabilitiesHeading}>
          <span className={styles.kicker}>WHO WE WORK WITH</span>
          <h2>One standard.<br />Every scale.</h2>
        </Fade>
        <div className={styles.capabilityGrid}>
          {capabilities.map(([title, copy, image]) => (
            <article className={styles.capabilityCard} key={title}>
              <div className={styles.capabilityImage}><Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" /></div>
              <div><h3>{title}</h3><p>{copy}</p><a href="/#contact">EXPLORE <span aria-hidden="true">→</span></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.approach}>
        <Fade className={styles.approachIntro}>
          <span className={styles.kicker}>THE LUMINIX APPROACH</span>
          <h2>A considered journey<br />from vision to installation.</h2>
        </Fade>
        <div className={styles.approachSteps}>
          {["Listen", "Design", "Engineer", "Install"].map((step, index) => (
            <div key={step}><span>0{index + 1}</span><h3>{step}</h3><p>{["Understand the space, the people, and the intention.", "Shape a solution around light, material, and proportion.", "Resolve every technical detail before production.", "Deliver a precise finish with minimal disruption."][index]}</p></div>
          ))}
        </div>
      </section>

      <section className={styles.region}>
        <Fade className={styles.regionCopy}>
          <span className={styles.kicker}>MIAMI & SOUTH FLORIDA</span>
          <h2>Designed here.<br />Ready for anywhere.</h2>
          <p>We serve homeowners, design professionals, and commercial teams throughout Miami, Fort Lauderdale, Boca Raton, Palm Beach, and beyond.</p>
          <a className="arrow-link" href="/#areas">VIEW SERVICE AREAS <span aria-hidden="true">→</span></a>
        </Fade>
        <div className={styles.regionImage}><Image src="/images/commercial.png" alt="Commercial interior overlooking the Miami skyline" fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
      </section>

      <section className={styles.finalSection}>
        <div className={styles.finalPanel}>
          <span className={styles.kicker}>START A CONVERSATION</span>
          <h2>Let&apos;s shape the right<br /><em>experience for your space.</em></h2>
          <div><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="mailto:hello@luminixshades.com">CONTACT OUR TEAM</a></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
