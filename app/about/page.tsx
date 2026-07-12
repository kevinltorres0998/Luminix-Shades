"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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

function RevealImage({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <motion.div className={className} initial={{ clipPath: "inset(0 0 12% 0)", opacity: .7, scale: 1.018 }} whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1, scale: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const principles = [
  ["Precision", "Every proportion, material, and movement is considered as part of the architecture.", "precisionIcon"],
  ["Discretion", "Technology should feel effortless—present when needed and nearly invisible when not.", "discretionIcon"],
  ["Craft", "Premium materials and exact installation turn functional systems into finished interiors.", "craftIcon"],
];

const capabilities = [
  ["Residential", "Private residences shaped around comfort, atmosphere, and daily rituals.", "/images/residential.png"],
  ["Commercial", "Scalable solutions for hospitality, workplace, retail, and signature developments.", "/images/about-hospitality.png"],
  ["Design Partners", "A collaborative resource for architects, designers, builders, and contractors.", "/images/architecture.png"],
];

export default function AboutPage() {
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 700], [0, 62]);

  return (
    <main className={styles.aboutPage}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <motion.div className={styles.heroMedia} style={{ y: heroImageY }}><Image src="/images/architecture.png" alt="Architectural glass residence at dusk" fill priority sizes="100vw" /></motion.div>
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
        <RevealImage className={styles.introImage}><Image src="/images/hero.png" alt="Refined Miami residence with controlled natural light" fill sizes="(max-width: 900px) 100vw, 58vw" /></RevealImage>
      </section>

      <section className={styles.principles}>
        <Fade className={styles.sectionHeading}>
          <span className={styles.kicker}>WHAT GUIDES US</span>
          <h2>Quiet confidence.<br />Obsessive attention.</h2>
          <p>Our work is defined by restraint, discipline, and an understanding that luxury is felt most clearly in the details.</p>
        </Fade>
        <div className={styles.principleGrid}>
          {principles.map(([title, copy, icon]) => (
            <Fade className={styles.principleCard} key={title}>
              <span className={`${styles.archIcon} ${styles[icon]}`} aria-hidden="true"><i /></span>
              <h3>{title}</h3><p>{copy}</p>
            </Fade>
          ))}
        </div>
      </section>

      <section className={styles.manifesto}>
        <Fade>
          <span className={styles.kicker}>OUR STARTING POINT</span>
          <h2>We don&apos;t begin with the product.<br /><em>We begin with the space.</em></h2>
          <p>Every project starts by understanding how light, privacy, architecture, and daily life come together. The solution comes after.</p>
        </Fade>
      </section>

      <section className={styles.details}>
        <Fade className={styles.detailsHeading}>
          <span className={styles.kicker}>ATTENTION TO DETAIL</span>
          <h2>The difference lives<br />in what others overlook.</h2>
          <p>Texture, alignment, movement, and finish are not secondary considerations. They are the experience.</p>
        </Fade>
        <div className={styles.detailGallery}>
          <motion.figure className={styles.fabricDetail} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .85, ease: [0.22, 1, 0.36, 1] }}>
            <div><Image src="/images/about-fabric-detail.png" alt="Close-up of premium sheer and linen drapery" fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
            <figcaption><span>01 / MATERIAL</span><p>Fabrics selected for the way they filter light, fall, and complete the room.</p></figcaption>
          </motion.figure>
          <motion.figure className={styles.motorDetail} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .85, delay: .12, ease: [0.22, 1, 0.36, 1] }}>
            <div><Image src="/images/about-motor-detail.png" alt="Precision installation of a concealed motorized shade" fill sizes="(max-width: 900px) 100vw, 38vw" /></div>
            <figcaption><span>02 / PRECISION</span><p>Concealed technology resolved down to the final architectural junction.</p></figcaption>
          </motion.figure>
        </div>
      </section>

      <section className={styles.approach}>
        <motion.span className={styles.approachLine} aria-hidden="true" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: .25 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
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

      <section className={styles.capabilities}>
        <Fade className={styles.capabilitiesHeading}>
          <span className={styles.kicker}>WHO WE WORK WITH</span>
          <h2>One standard.<br />Every scale.</h2>
        </Fade>
        <div className={styles.capabilityGrid}>
          {capabilities.map(([title, copy, image], index) => (
            <motion.article className={styles.capabilityCard} key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .7, delay: index * .08, ease: [0.22, 1, 0.36, 1] }}>
              <div className={styles.capabilityImage}><Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" /></div>
              <div><h3>{title}</h3><p>{copy}</p><a href="/#contact">EXPLORE <span aria-hidden="true">→</span></a></div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.technology}>
        <RevealImage className={styles.technologyImage}><Image src="/images/about-smart-film-detail.png" alt="Smart film transitioning from transparent to frosted glass" fill sizes="(max-width: 900px) 100vw, 58vw" /></RevealImage>
        <Fade className={styles.technologyCopy}>
          <span className={styles.kicker}>TECHNOLOGY & CRAFT</span>
          <h2>Advanced systems.<br /><em>Beautifully resolved.</em></h2>
          <p>Innovation matters only when it improves the experience of the architecture. We pair proven technology with exact specification, careful fabrication, and a disciplined installation process.</p>
          <div className={styles.technologyNotes}><span>Quiet movement</span><span>Seamless integration</span><span>Precise control</span></div>
        </Fade>
      </section>

      <section className={styles.partners}>
        <Fade className={styles.partnersIntro}>
          <span className={styles.kicker}>TRUSTED TECHNOLOGY PARTNERS</span>
          <p>We work with established systems selected for performance, reliability, and elegant integration.</p>
        </Fade>
        <motion.div className={styles.partnerNames} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .4 }} transition={{ duration: 1.1, ease: "easeOut" }}><b>somfy.</b><b>LUTRON.</b><b>SMARTTINT®</b><b className={styles.partnerSerif}>ALTA</b><b>mecho</b></motion.div>
      </section>

      <section className={styles.region}>
        <Fade className={styles.regionCopy}>
          <span className={styles.kicker}>MIAMI & SOUTH FLORIDA</span>
          <h2>Designed here.<br />Ready for anywhere.</h2>
          <p>We serve homeowners, design professionals, and commercial teams throughout Miami, Fort Lauderdale, Boca Raton, Palm Beach, and beyond.</p>
          <a className="arrow-link" href="/#areas">VIEW SERVICE AREAS <span aria-hidden="true">→</span></a>
        </Fade>
        <RevealImage className={styles.regionImage}><Image src="/images/smart-film.png" alt="South Florida interior overlooking the water" fill sizes="(max-width: 900px) 100vw, 58vw" /></RevealImage>
      </section>

      <section className={styles.finalSection}>
        <div className={styles.finalPanel}>
          <span className={styles.kicker}>THE BEGINNING OF SOMETHING CONSIDERED</span>
          <h2>Bring us the space.<br /><em>We&apos;ll begin with the light.</em></h2>
          <p>Every meaningful project begins with a conversation about how you want the environment to feel.</p>
          <div><a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="mailto:hello@luminixshades.com">CONTACT OUR TEAM</a></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
