"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { BOOKING_URL } from "../lib/booking";
import styles from "./about.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) { return <NextImage {...props} unoptimized />; }
function Fade({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .14 }} transition={{ duration: .78, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>; }
function RevealImage({ children, className }: { children: React.ReactNode; className: string }) { return <motion.div className={className} initial={{ clipPath: "inset(0 0 10% 0)", opacity: .75, scale: 1.018 }} whileInView={{ clipPath: "inset(0 0 0 0)", opacity: 1, scale: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>; }

const principles = [
  { icon: "spaceIcon", title: "We begin with the space.", copy: "Every recommendation starts with understanding architecture, lifestyle, and purpose." },
  { icon: "technologyIcon", title: "Technology should disappear.", copy: "Comfort, beauty, and performance should remain. We integrate technology with intention." },
  { icon: "tailoredIcon", title: "Every solution is tailored.", copy: "No templates. No standards. Only solutions designed for your space." },
  { icon: "materialsIcon", title: "Materials matter. Details matter even more.", copy: "We select the finest materials and obsess over every detail." },
  { icon: "luxuryIcon", title: "Luxury is how a space feels.", copy: "True luxury is measured by comfort, calm, and the way a space makes you feel." },
];

const details = [
  { image: "/images/about-fabric-detail.png", alt: "Close-up of a precisely finished drapery seam", caption: "Perfect seams. Every time." },
  { image: "/images/about-motor-detail.png", alt: "Concealed motorized shade hardware integrated into architecture", caption: "Concealed hardware. Visible perfection." },
  { image: "/images/about-smart-film-detail.png", alt: "Precise glass junction with integrated smart film", caption: "Engineered for flawless integration." },
  { image: "/images/drapery-fabric-library.png", alt: "Premium natural fabric texture in warm neutral tones", caption: "The finest fabrics. Chosen carefully." },
  { image: "/images/smart-film-control-detail.png", alt: "Clean architectural control and finished wall junction", caption: "Clean lines. Nothing out of place." },
];

const experience = [
  { icon: "consultIcon", number: "01", title: "Consult", copy: "We listen, understand your needs, and analyze your space." },
  { icon: "designIcon", number: "02", title: "Design", copy: "We create the ideal solution tailored to your lifestyle." },
  { icon: "customizeIcon", number: "03", title: "Customize", copy: "Every detail is customized to fit your space perfectly." },
  { icon: "installIcon", number: "04", title: "Install", copy: "Our team installs with precision, respect, and care." },
  { icon: "enjoyIcon", number: "05", title: "Enjoy", copy: "Experience comfort, privacy, and beauty every single day." },
];

export default function AboutPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 760], [0, 54]);
  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <motion.div className={styles.heroMedia} style={{ y: heroY }} initial={{ opacity: .72, scale: 1.035 }} animate={{ opacity: 1, scale: 1.01 }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}><Image src="/images/solutions-showroom-hero-v2.webp" alt="Sophisticated waterfront residence with floor-to-ceiling glass and integrated window solutions" fill priority sizes="100vw" /></motion.div>
        <div className={styles.heroShade} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .95, ease: [0.22, 1, 0.36, 1] }}><span className={styles.kicker}>ABOUT LUMINIX SHADES</span><h1>We design how<br />light <em>is experienced.</em></h1><p>Architectural window solutions where refined design, intelligent technology, and precise craftsmanship work as one.</p><a className={styles.textLink} href="#philosophy">DISCOVER OUR APPROACH <span>→</span></a></motion.div>
      </section>

      <section className={styles.manifesto}>
        <Fade className={styles.logoStage}><Image src="/images/logo-white.png" alt="Luminix Shades" width={2420} height={689} sizes="50vw" /></Fade>
        <Fade className={styles.manifestoCopy}><span className={styles.kicker}>OUR MANIFESTO</span><h2>Every space has its own rhythm.<br />Every window changes the way people live.<br />Every material changes the atmosphere.<br />We believe great design should solve problems without drawing attention to itself.</h2><i aria-hidden="true" /><strong>DESIGNED AROUND PEOPLE, ALWAYS.</strong></Fade>
      </section>

      <section className={styles.philosophy} id="philosophy">
        <Fade className={styles.philosophyCopy}><span className={styles.kicker}>OUR PHILOSOPHY</span><h2>We begin with<br />the <em>space.</em></h2><p>Not the product. Not the trend.<br />We listen, understand, and study every detail before recommending a solution.<br />The result is a space that looks effortless, feels comfortable, and functions perfectly.</p><a className={styles.textLink} href="#principles">LEARN MORE ABOUT OUR APPROACH <span>→</span></a></Fade>
        <RevealImage className={styles.philosophyImage}><Image src="/images/architecture.png" alt="Transparent glass and integrated privacy within a refined architectural interior" fill sizes="(max-width:800px) 100vw, 67vw" /></RevealImage>
      </section>

      <section className={styles.principles} id="principles"><span className={styles.kicker}>OUR PRINCIPLES</span><div className={styles.principleGrid}>{principles.map((item,index) => <Fade className={styles.principle} key={item.title}><span className={`${styles.lineIcon} ${styles[item.icon]}`} aria-hidden="true"><i /></span><h3>{item.title}</h3><p>{item.copy}</p>{index < principles.length - 1 && <b aria-hidden="true" />}</Fade>)}</div></section>

      <section className={styles.founder} aria-labelledby="founder-heading">
        <RevealImage className={styles.founderPortrait}><Image src="/images/luminix-founder-ceo.png" alt="Founder and CEO of Luminix Shades" fill sizes="(max-width:760px) 100vw, 38vw" /></RevealImage>
        <Fade className={styles.founderCopy}><span className={styles.kicker}>LEADERSHIP</span><h2 id="founder-heading">A vision shaped<br />by <em>intention.</em></h2><i aria-hidden="true" /><strong>Kevin L Torres</strong><small>CEO &amp; FOUNDER · LUMINIX SHADES</small></Fade>
      </section>

      <section className={styles.details} id="details">
        <Fade className={styles.detailsIntro}><span className={styles.kicker}>THE DIFFERENCE LIVES</span><h2>in what others overlook.</h2><i aria-hidden="true" /><p>Obsessive attention to detail.<br />Flawless execution.<br />This is what sets our work apart.</p><a className={styles.textLink} href="#experience">SEE THE DETAILS <span>→</span></a></Fade>
        <div className={styles.detailGrid}>{details.map((detail,index) => <motion.figure key={detail.caption} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .7, delay: index * .07, ease: [0.22, 1, 0.36, 1] }}><div><Image src={detail.image} alt={detail.alt} fill sizes="(max-width:700px) 50vw, 16vw" /></div><figcaption>{detail.caption}</figcaption></motion.figure>)}</div>
      </section>

      <section className={styles.experience} id="experience">
        <Fade className={styles.experienceIntro}><span className={styles.kicker}>THE LUMINIX EXPERIENCE</span><h2>A considered journey<br />from vision to installation.</h2></Fade>
        <div className={styles.experienceSteps}>{experience.map((step,index) => <Fade className={styles.experienceStep} key={step.number}><span className={`${styles.lineIcon} ${styles[step.icon]}`} aria-hidden="true"><i /></span><small>{step.number}</small><h3>{step.title}</h3><p>{step.copy}</p>{index < experience.length - 1 && <b aria-hidden="true" />}</Fade>)}</div>
      </section>

      <section className={styles.partners}>
        <Fade className={styles.partnersIntro}><span className={styles.kicker}>TECHNOLOGY & PARTNERSHIP</span><h2>Advanced systems.<br />Beautifully resolved.</h2><p>We partner with the world&apos;s leading manufacturers to deliver technology that elevates every space. Integrated with precision. Built to last.</p><a className={styles.textLink} href="#partner-marks">OUR PARTNERS <span>→</span></a></Fade>
        <motion.div className={styles.partnerMarks} id="partner-marks" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .3 }} transition={{ duration: 1 }}><b>LUTRON.</b><b>somfy.</b><b>SMARTTINT®</b><b className={styles.partnerSerif}>ALTA</b><b>mecho</b></motion.div>
      </section>

      <section className={styles.finalCta} id="contact"><div className={styles.finalShade} /><div><h2>Let&apos;s design the right<br />solution for your space.</h2><p>Schedule a private consultation and discover the perfect balance of light, privacy, and beauty.</p><a className="button button-gold" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="mailto:hello@luminixshades.com">CONTACT OUR TEAM</a></div></section>

      <SiteFooter />
    </main>
  );
}
