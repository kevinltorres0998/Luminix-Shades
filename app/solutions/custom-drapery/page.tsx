"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import { useState } from "react";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import styles from "./custom-drapery.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) {
  return <NextImage {...props} unoptimized />;
}

function Fade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const fabrics = {
  sheer: {
    label: "Sheer",
    title: "Weightless light.",
    copy: "Airy, luminous, and quietly private. Sheer layers soften the room without closing it in.",
    image: "/images/drapery-hero-sheer.png",
  },
  linen: {
    label: "Linen",
    title: "Natural structure.",
    copy: "A relaxed weave with tailored presence, balancing texture, warmth, and filtered daylight.",
    image: "/images/drapery-room-linen.png",
  },
  velvet: {
    label: "Velvet",
    title: "Depth and drama.",
    copy: "Rich texture and sculptural folds create an intimate atmosphere with unmistakable softness.",
    image: "/images/drapery-room-velvet.png",
  },
  blackout: {
    label: "Blackout",
    title: "Rest, beautifully framed.",
    copy: "Tailored opacity brings privacy and calm while preserving the elegance of the architecture.",
    image: "/images/drapery-room-blackout.png",
  },
} as const;

type Fabric = keyof typeof fabrics;

const pleats = ["Ripple Fold", "Pinch Pleat", "Goblet Pleat", "Wave Fold"];
const samples: { name: string; fabric: Fabric }[] = [
  { name: "Ivory Linen", fabric: "linen" },
  { name: "Sand Linen", fabric: "linen" },
  { name: "Pearl Sheer", fabric: "sheer" },
  { name: "Stone Velvet", fabric: "velvet" },
  { name: "Charcoal Linen", fabric: "blackout" },
];
const finishes = ["Matte Black", "Champagne", "Brushed Nickel", "Bronze", "White"];
const spaces = [
  ["Living Room", "/images/drapery-hero-sheer.png"],
  ["Bedroom", "/images/about-hospitality.png"],
  ["Dining Room", "/images/drapery-room-linen.png"],
  ["Office", "/images/commercial-smart-film-cover-v3.png"],
  ["Hotel", "/images/about-fabric-detail.png"],
  ["Luxury Residence", "/images/drapery-room-velvet.png"],
];
const installations = [
  ["Key Biscayne Residence", "Ripple Fold Sheer", "/images/drapery-hero-sheer.png"],
  ["Brickell Penthouse", "Tailored Linen", "/images/drapery-room-linen.png"],
  ["Miami Beach Suite", "Stone Velvet", "/images/drapery-room-velvet.png"],
  ["Coral Gables Residence", "Layered Blackout", "/images/drapery-room-blackout.png"],
];

export default function CustomDraperyPage() {
  const [fabric, setFabric] = useState<Fabric>("sheer");
  const [sample, setSample] = useState("Pearl Sheer");
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 820], [0, 58]);

  const selectSample = (name: string, nextFabric: Fabric) => {
    setSample(name);
    setFabric(nextFabric);
    document.getElementById("fabric-experience")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <motion.div className={styles.heroMedia} style={{ y: heroY }}>
          <Image src="/images/drapery-hero-sheer.png" alt="Luxury Miami living room framed by full-height custom sheer drapery" fill priority loading="eager" sizes="100vw" />
        </motion.div>
        <div className={styles.heroShade} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}>
          <span className={styles.kicker}>CUSTOM DRAPERY</span>
          <h1>Tailored for<br />the way you live.</h1>
          <p>Luxury fabrics. Impeccable craftsmanship. Timeless elegance designed for modern interiors.</p>
          <a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a>
        </motion.div>
        <span className={styles.scrollCue} aria-hidden="true">SCROLL <i /></span>
      </section>

      <section className={styles.fabricExperience} id="fabric-experience">
        <Fade className={styles.fabricCopy}>
          <span className={styles.kicker}>THE POWER OF FABRIC</span>
          <h2>Fabric changes<br />everything.</h2>
          <p>Explore how texture, weight, and transparency transform the light, mood, and atmosphere of a space.</p>
        </Fade>
        <Fade className={styles.fabricStage}>
          <div className={styles.fabricTabs} role="tablist" aria-label="Drapery fabric collections">
            {(Object.keys(fabrics) as Fabric[]).map((key) => (
              <button key={key} type="button" role="tab" aria-selected={fabric === key} className={fabric === key ? styles.activeFabric : ""} onClick={() => setFabric(key)}>
                {fabrics[key].label}
              </button>
            ))}
          </div>
          <div className={styles.roomPreview}>
            <AnimatePresence mode="wait">
              <motion.div key={fabric} className={styles.previewImage} initial={{ opacity: 0, scale: 1.012 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}>
                <Image src={fabrics[fabric].image} alt={`${fabrics[fabric].label} custom drapery in the same luxury living room`} fill loading="eager" sizes="(max-width: 900px) 100vw, 70vw" />
              </motion.div>
            </AnimatePresence>
            <div className={styles.previewShade} />
            <motion.div key={`${fabric}-copy`} className={styles.previewCopy} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.36 }}>
              <span>{fabrics[fabric].label.toUpperCase()}</span>
              <h3>{fabrics[fabric].title}</h3>
              <p>{fabrics[fabric].copy}</p>
            </motion.div>
          </div>
        </Fade>
      </section>

      <section className={styles.pleats}>
        <Fade className={styles.sectionIntro}>
          <span className={styles.kicker}>CRAFTED TO PERFECTION</span>
          <h2>Every fold<br />matters.</h2>
          <p>Different pleats. Different character.<br />Designed to elevate your space.</p>
        </Fade>
        <div className={styles.pleatGrid}>
          {pleats.map((pleat, index) => (
            <Fade className={styles.pleatCard} key={pleat}>
              <div className={styles.pleatImage} style={{ backgroundPosition: `${index * 33.333}% center` }} />
              <div><span>0{index + 1}</span><h3>{pleat}</h3><i aria-hidden="true">↗</i></div>
            </Fade>
          ))}
        </div>
      </section>

      <section className={styles.library}>
        <Fade className={styles.libraryIntro}>
          <span className={styles.kicker}>FABRIC LIBRARY</span>
          <h2>Curated materials.<br />Unlimited possibilities.</h2>
          <p>Select a material to see it shape the room above.</p>
        </Fade>
        <div className={styles.sampleGrid}>
          {samples.map((item, index) => (
            <motion.button key={item.name} type="button" className={sample === item.name ? styles.activeSample : ""} aria-pressed={sample === item.name} onClick={() => selectSample(item.name, item.fabric)} whileHover={{ y: -4 }}>
              <span className={styles.sampleImage} style={{ backgroundPosition: `${index * 25}% center` }} />
              <b>{item.name}</b><i>{sample === item.name ? "✓" : "↗"}</i>
            </motion.button>
          ))}
        </div>
      </section>

      <section className={styles.hardware}>
        <Fade className={styles.hardwareIntro}>
          <span className={styles.kicker}>HARDWARE COLLECTION</span>
          <h2>The details<br />define the design.</h2>
          <p>Architectural tracks and premium finishes complete every composition.</p>
        </Fade>
        <div className={styles.finishGrid}>
          {finishes.map((finish, index) => (
            <Fade className={styles.finishCard} key={finish}>
              <div className={`${styles.hardwarePiece} ${styles[`finish${index}`]}`}><span /><i /></div>
              <h3>{finish}</h3>
            </Fade>
          ))}
        </div>
      </section>

      <section className={styles.spaces}>
        <Fade className={styles.spacesTitle}><span className={styles.kicker}>DESIGNED FOR EVERY SPACE</span><h2>Softness, tailored<br />to the architecture.</h2></Fade>
        <div className={styles.spaceGrid}>
          {spaces.map(([title, image]) => (
            <motion.article key={title} whileHover={{ y: -4 }}>
              <Image src={image} alt={`${title} with custom Luminix drapery`} fill sizes="(max-width: 760px) 50vw, 16vw" />
              <div><h3>{title}</h3><span>↗</span></div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.process}>
        <Fade className={styles.processIntro}><span className={styles.kicker}>OUR PROCESS</span><h2>Thoughtful from<br />start to finish.</h2></Fade>
        <div className={styles.timeline}>
          {["Consultation", "Measurement", "Fabric Selection", "Craftsmanship", "Installation"].map((step, index) => (
            <Fade className={styles.processStep} key={step}>
              <span>0{index + 1}</span>
              <i aria-hidden="true">{["⌂", "↔", "◇", "✣", "⌁"][index]}</i>
              <h3>{step}</h3>
              <p>{["We learn your vision, needs, and style.", "Precision measurements for a perfect fit.", "Handpicked fabrics and custom details.", "Expertly tailored with care and precision.", "A flawless finish, installed professionally."][index]}</p>
            </Fade>
          ))}
        </div>
      </section>

      <section className={styles.installations}>
        <Fade className={styles.installIntro}><span className={styles.kicker}>FEATURED INSTALLATIONS</span><h2>Real spaces.<br />Quietly exceptional.</h2></Fade>
        <div className={styles.installGrid}>
          {installations.map(([title, note, image]) => (
            <motion.article key={title} whileHover="hover">
              <Image src={image} alt={`${title} custom drapery installation`} fill sizes="(max-width: 760px) 100vw, 22vw" />
              <motion.div variants={{ hover: { y: -3 } }}><h3>{title}</h3><p>{note}</p><span>↗</span></motion.div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <Image src="/images/drapery-final-sunset.png" alt="Flowing ivory drapery overlooking Miami at sunset" fill sizes="100vw" />
        <div className={styles.finalShade} />
        <Fade className={styles.finalContent}>
          <span className={styles.kicker}>BEGIN WITH THE SPACE</span>
          <h2>Luxury is in<br />the details.</h2>
          <p>Let&apos;s create something exceptional together.</p>
          <a className="button button-gold" href="/#contact">SCHEDULE A CONSULTATION</a>
        </Fade>
      </section>

      <SiteFooter />
    </main>
  );
}
