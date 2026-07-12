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
    characteristics: "Soft diffusion · Natural movement · Layered privacy",
    image: "/images/drapery-hero-sheer.png",
  },
  linen: {
    label: "Linen",
    title: "Natural structure.",
    copy: "A relaxed weave with tailored presence, balancing texture, warmth, and filtered daylight.",
    characteristics: "Natural texture · Filtered light · Timeless structure",
    image: "/images/drapery-room-linen.png",
  },
  velvet: {
    label: "Velvet",
    title: "Depth and drama.",
    copy: "Rich texture and sculptural folds create an intimate atmosphere with unmistakable softness.",
    characteristics: "Acoustic softness · Rich depth · Dramatic drape",
    image: "/images/drapery-room-velvet.png",
  },
  blackout: {
    label: "Blackout",
    title: "Rest, beautifully framed.",
    copy: "Tailored opacity brings privacy and calm while preserving the elegance of the architecture.",
    characteristics: "Room darkening · Thermal comfort · Complete privacy",
    image: "/images/drapery-room-blackout.png",
  },
} as const;

type Fabric = keyof typeof fabrics;

const pleats = [
  { name: "Ripple Fold", description: "Continuous, architectural waves create a clean rhythm from every angle.", benefits: "Modern lines · Effortless movement · Ideal for wide openings" },
  { name: "Pinch Pleat", description: "Precisely tailored folds bring quiet structure and enduring elegance.", benefits: "Tailored profile · Full body · Timeless character" },
  { name: "Goblet Pleat", description: "Sculptural headings give formal interiors a refined, dimensional presence.", benefits: "Statement detail · Luxurious fullness · Formal elegance" },
  { name: "Wave Fold", description: "Soft, consistent folds balance relaxed movement with contemporary precision.", benefits: "Fluid stack · Minimal profile · Smooth operation" },
];
const samples: { name: string; fabric: Fabric; description: string; characteristics: string }[] = [
  { name: "Ivory Linen", fabric: "linen", description: "A warm, softly woven linen that brings natural light and understated texture into the room.", characteristics: "Organic weave · Warm ivory · Filtered daylight" },
  { name: "Sand Linen", fabric: "linen", description: "A grounded neutral with an organic hand, designed for calm architectural interiors.", characteristics: "Natural fibers · Relaxed structure · Warm neutral" },
  { name: "Pearl Sheer", fabric: "sheer", description: "A luminous voile that diffuses direct sun while preserving openness and movement.", characteristics: "Translucent · Airy · Soft light diffusion" },
  { name: "Stone Velvet", fabric: "velvet", description: "A dense, tactile velvet with subtle luster and beautifully sculpted folds.", characteristics: "Rich pile · Acoustic softness · Dimensional color" },
  { name: "Charcoal Linen", fabric: "blackout", description: "A deep architectural linen pairing visual depth with enhanced privacy and light control.", characteristics: "Deep tone · Refined texture · Enhanced privacy" },
];
const finishes = ["Matte Black", "Champagne", "Brushed Nickel", "Bronze", "White"];
const spaces = [
  { name: "Living Room", image: "/images/drapery-hero-sheer.png", description: "Layered softness frames the view without interrupting the architecture.", recommended: "Pearl Sheer · Ivory Linen" },
  { name: "Bedroom", image: "/images/about-hospitality.png", description: "Privacy, acoustic comfort, and restful light control tailored for retreat.", recommended: "Blackout · Stone Velvet" },
  { name: "Dining Room", image: "/images/drapery-room-linen.png", description: "Natural texture and elegant fullness create warmth for every gathering.", recommended: "Sand Linen · Ripple Fold" },
  { name: "Office", image: "/images/commercial-smart-film-cover-v3.png", description: "Refined glare control softens the workspace while maintaining focus and clarity.", recommended: "Screen Sheer · Wave Fold" },
  { name: "Hotel", image: "/images/about-fabric-detail.png", description: "Durable luxury and layered privacy designed for elevated hospitality experiences.", recommended: "Velvet · Layered Blackout" },
  { name: "Luxury Residence", image: "/images/drapery-room-velvet.png", description: "A complete textile composition shaped around scale, mood, and architectural detail.", recommended: "Custom Layering · Motorized Ripple Fold" },
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
  const [pleat, setPleat] = useState(0);
  const [space, setSpace] = useState(0);
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
              <small>{fabrics[fabric].characteristics}</small>
            </motion.div>
          </div>
        </Fade>
      </section>

      <section className={styles.pleats}>
        <Fade className={styles.sectionIntro}>
          <span className={styles.kicker}>CRAFTED TO PERFECTION</span>
          <h2>Every fold<br />matters.</h2>
          <AnimatePresence mode="wait">
            <motion.div key={pleat} className={styles.selectorCopy} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.28 }}>
              <p>{pleats[pleat].description}</p>
              <small>{pleats[pleat].benefits}</small>
            </motion.div>
          </AnimatePresence>
        </Fade>
        <div className={styles.pleatGrid}>
          {pleats.map((item, index) => (
            <motion.button className={`${styles.pleatCard} ${pleat === index ? styles.activePleat : ""}`} key={item.name} type="button" aria-pressed={pleat === index} onClick={() => setPleat(index)} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}>
              <div className={styles.pleatImage} style={{ backgroundPosition: `${index * 33.333}% center` }} />
              <div><span>0{index + 1}</span><h3>{item.name}</h3><i aria-hidden="true">{pleat === index ? "✓" : "↗"}</i></div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className={styles.library}>
        <Fade className={styles.libraryIntro}>
          <span className={styles.kicker}>FABRIC LIBRARY</span>
          <h2>Curated materials.<br />Unlimited possibilities.</h2>
          <AnimatePresence mode="wait">
            <motion.div key={sample} className={styles.selectorCopy} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.28 }}>
              <p>{samples.find((item) => item.name === sample)?.description}</p>
              <small>{samples.find((item) => item.name === sample)?.characteristics}</small>
            </motion.div>
          </AnimatePresence>
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
        <Fade className={styles.spacesTitle}>
          <div><span className={styles.kicker}>DESIGNED FOR EVERY SPACE</span><h2>Softness, tailored<br />to the architecture.</h2></div>
          <AnimatePresence mode="wait">
            <motion.div key={space} className={styles.spaceSelection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.3 }}>
              <span>{spaces[space].name.toUpperCase()}</span>
              <p>{spaces[space].description}</p>
              <small>RECOMMENDED · {spaces[space].recommended}</small>
            </motion.div>
          </AnimatePresence>
        </Fade>
        <div className={styles.spaceGrid}>
          {spaces.map((item, index) => (
            <motion.button key={item.name} type="button" className={space === index ? styles.activeSpace : ""} aria-pressed={space === index} onClick={() => setSpace(index)} whileHover={{ y: -4 }}>
              <Image src={item.image} alt={`${item.name} with custom Luminix drapery`} fill sizes="(max-width: 760px) 50vw, 16vw" />
              <div><h3>{item.name}</h3><span>{space === index ? "✓" : "↗"}</span></div>
            </motion.button>
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
