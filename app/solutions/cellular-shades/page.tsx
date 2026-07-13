"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import { useState } from "react";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { BOOKING_URL } from "../../lib/booking";
import styles from "./cellular-shades.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) {
  return <NextImage {...props} unoptimized />;
}

function Fade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const collections = {
  light: {
    label: "Light Filtering",
    title: "Daylight, beautifully softened.",
    description: "A luminous cellular weave that reduces glare while keeping the room open, bright, and naturally comfortable.",
    applications: "Living rooms · Kitchens · Home offices",
  },
  translucent: {
    label: "Translucent",
    title: "Privacy with a quiet glow.",
    description: "Softly diffused light and increased daytime privacy create a calm atmosphere without closing the room in.",
    applications: "Street-facing rooms · Dining spaces · Studios",
  },
  darkening: {
    label: "Room Darkening",
    title: "Rest begins with the light.",
    description: "A denser cellular construction lowers brightness and glare for more restful, controlled interiors.",
    applications: "Bedrooms · Nurseries · Media rooms",
  },
  blackout: {
    label: "Blackout",
    title: "Complete calm, on demand.",
    description: "Maximum light control, thermal comfort, and privacy for spaces designed around uninterrupted rest.",
    applications: "Primary suites · Cinemas · Shift-work bedrooms",
  },
} as const;

type Collection = keyof typeof collections;

const spaces = [
  { name: "Bedroom", cardCopy: "Deeper rest and more stable comfort.", headline: "Better sleep begins with better comfort.", description: "Create a quieter, darker, and more temperature-controlled bedroom with Cellular Shades designed for restful sleep throughout the year.", image: "/images/cellular-hero-winter.webp", fabric: "Room Darkening", opacity: "95%", privacy: 5, light: 4, thermal: 5, noise: 4, benefits: ["More stable overnight temperature", "Reduced early-morning glare", "Softened exterior noise"] },
  { name: "Living Room", cardCopy: "Filtered daylight without the glare.", headline: "Natural light without sacrificing comfort.", description: "Maintain a bright, inviting living space while reducing glare, solar heat, and the exposed feeling of floor-to-ceiling glass.", image: "/images/cellular-compare-with.webp", fabric: "Light Filtering", opacity: "50%", privacy: 3, light: 4, thermal: 4, noise: 3, benefits: ["Soft, usable natural daylight", "Reduced solar heat at the glass", "Comfort without losing the view"] },
  { name: "Home Office", cardCopy: "A quieter, more focused environment.", headline: "Comfort that helps you focus.", description: "Control screen glare, create privacy for meetings, and maintain a more consistent temperature through long workdays.", image: "/images/cellular-space-office-v2.webp", fabric: "Translucent", opacity: "65%", privacy: 4, light: 5, thermal: 4, noise: 4, benefits: ["Reduced monitor reflections", "Private, professional video calls", "Improved acoustic concentration"] },
  { name: "Nursery", cardCopy: "Gentle light for peaceful routines.", headline: "A quieter room for peaceful moments.", description: "Create a calm sleeping environment with cordless Cellular Shades that soften noise, stabilize temperature, and provide dependable blackout comfort.", image: "/images/cellular-space-nursery-v2.webp", fabric: "Blackout", opacity: "100%", privacy: 5, light: 5, thermal: 5, noise: 4, benefits: ["Child-safe cordless operation", "Dependable daytime darkness", "Gentler temperature transitions"] },
  { name: "Media Room", cardCopy: "Controlled brightness and acoustic calm.", headline: "Cinema comfort at home.", description: "Maximum blackout reduces reflections and visual distractions while the cellular structure supports a quieter, more immersive viewing environment.", image: "/images/cellular-space-media-v2.webp", fabric: "Blackout", opacity: "100%", privacy: 5, light: 5, thermal: 4, noise: 5, benefits: ["Near-total reflection control", "Enhanced acoustic softness", "Complete visual privacy"] },
];

const comfortDetails = [
  ["honeycomb", "Honeycomb Technology", "Insulating cells trap air at the window to create a quiet thermal barrier."],
  ["efficiency", "Year-Round Efficiency", "Keep warmth in during winter and reduce solar heat gain during summer."],
  ["quiet", "Peace & Quiet", "Layered cells soften outside noise and reduce the hard echo of exposed glass."],
  ["privacy", "Privacy You Can Feel", "From filtered daylight to blackout, comfort and discretion stay in balance."],
];

export default function CellularShadesPage() {
  const [divider, setDivider] = useState(50);
  const [collection, setCollection] = useState<Collection>("light");
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 780], [0, 54]);

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <motion.div className={styles.heroMedia} style={{ y: heroY }}>
          <Image src="/images/cellular-hero-winter.webp" alt="Warm luxury bedroom with cellular shades overlooking a peaceful winter landscape" fill priority loading="eager" sizes="100vw" />
        </motion.div>
        <div className={styles.heroShade} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}>
          <span className={styles.kicker}>CELLULAR SHADES</span>
          <h1>Comfort,<br /><em>engineered.</em></h1>
          <p>Cellular shades create a natural barrier at the window—bringing warmth, quiet, privacy, and beautifully controlled light into every room.</p>
          <div className={styles.heroActions}>
            <a className="button button-gold" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">SCHEDULE A CONSULTATION</a>
            <a className="button button-outline" href="#living">VIEW GALLERY</a>
          </div>
          <div className={styles.heroProof}>
            <span>THERMAL COMFORT</span><span>QUIETER INTERIORS</span><span>TAILORED PRIVACY</span>
          </div>
        </motion.div>
      </section>

      <section className={styles.comparisonSection} id="experience">
        <Fade className={styles.compareIntro}>
          <span className={styles.kicker}>FEEL THE DIFFERENCE</span>
          <h2>Not just a shade.<br /><em>A better environment.</em></h2>
          <p>Drag across the same room to experience how Cellular Shades transform everyday comfort.</p>
          <small>DRAG TO COMPARE <i aria-hidden="true">↔</i></small>
        </Fade>
        <Fade className={styles.compareStage}>
          <Image src="/images/cellular-compare-without.webp" alt="Bright living room without cellular shades" fill sizes="(max-width: 900px) 100vw, 72vw" />
          <div className={styles.withState} style={{ clipPath: `inset(0 0 0 ${divider}%)` }}>
            <Image src="/images/cellular-compare-with.webp" alt="The same living room made calmer and more comfortable with cellular shades" fill sizes="(max-width: 900px) 100vw, 72vw" />
          </div>
          <span className={`${styles.stateLabel} ${styles.withoutLabel}`}>WITHOUT<br />CELLULAR SHADES</span>
          <span className={`${styles.stateLabel} ${styles.withLabel}`}>WITH<br />CELLULAR SHADES</span>
          <span className={styles.divider} style={{ left: `${divider}%` }} aria-hidden="true"><i>‹</i><i>›</i></span>
          <input type="range" min="12" max="88" value={divider} onChange={(event) => setDivider(Number(event.target.value))} aria-label="Compare the room without and with Cellular Shades" />
        </Fade>
        <div className={styles.comfortMetrics}>
          {[
            ["Temperature", "HOT", "COMFORTABLE", 46, 78],
            ["Noise Level", "LOUD", "QUIET", 58, 34],
            ["Light Control", "HARSH", "SOFT & CONTROLLED", 42, 82],
            ["Privacy", "LOW", "HIGH", 24, 92],
          ].map(([label, before, after, beforeLevel, afterLevel]) => (
            <div className={styles.metric} key={label as string}>
              <b>{label}</b><span>{before}</span><i style={{ "--level": `${beforeLevel}%` } as React.CSSProperties} /><span>{after}</span><i style={{ "--level": `${afterLevel}%` } as React.CSSProperties} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.comfortSection}>
        <Fade className={styles.comfortIntro}><span className={styles.kicker}>WHY CELLULAR SHADES</span><h2>Luxury comfort<br />in every detail.</h2></Fade>
        <div className={styles.comfortGrid}>
          {comfortDetails.map(([icon, title, copy]) => (
            <Fade className={styles.comfortCard} key={title}>
              <span className={`${styles.lineIcon} ${styles[icon]}`} aria-hidden="true"><i /></span>
              <h3>{title}</h3><p>{copy}</p>
            </Fade>
          ))}
        </div>
      </section>

      <section className={styles.collectionSection} id="collections">
        <Fade className={styles.collectionIntro}>
          <span className={styles.kicker}>DESIGNED FOR HOW YOU LIVE</span>
          <h2>Light. Privacy.<br />Perfectly balanced.</h2>
          <p>Choose the opacity that fits your space and your day—from soft daylight to complete blackout.</p>
        </Fade>
        <Fade className={styles.collectionShowroom}>
          <div className={styles.collectionTabs} role="tablist" aria-label="Cellular shade fabric collections">
            {(Object.keys(collections) as Collection[]).map((key) => <button key={key} role="tab" type="button" aria-selected={collection === key} className={collection === key ? styles.activeCollection : ""} onClick={() => setCollection(key)}>{collections[key].label}</button>)}
          </div>
          <div className={styles.collectionPreview}>
            <Image src="/images/cellular-compare-with.webp" alt={`${collections[collection].label} cellular shades in a luxury living room`} fill sizes="(max-width: 900px) 100vw, 68vw" />
            <AnimatePresence mode="wait">
              <motion.div key={collection} className={`${styles.fabricMood} ${styles[`${collection}Mood`]}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.42 }} />
            </AnimatePresence>
            <motion.div key={`${collection}-copy`} className={styles.collectionCopy} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34 }}>
              <span>{collections[collection].label.toUpperCase()}</span><h3>{collections[collection].title}</h3><p>{collections[collection].description}</p><small>RECOMMENDED · {collections[collection].applications}</small>
            </motion.div>
          </div>
        </Fade>
      </section>

      <section className={styles.livingSection} id="living">
        <AnimatePresence mode="wait">
          {selectedSpace === null ? (
            <motion.div key="space-index" className={styles.livingDefault} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.34 }}>
              <Fade className={styles.livingTitle}><span className={styles.kicker}>DESIGNED FOR EVERYDAY LIVING</span><h2>Comfort follows<br />you through the home.</h2></Fade>
              <div className={styles.spaceGrid}>
                {spaces.map((space, index) => (
                  <motion.button key={space.name} type="button" aria-label={`Explore Cellular Shades for ${space.name}`} onClick={() => setSelectedSpace(index)} whileHover={{ y: -4 }}>
                    <span className={styles.spaceImage} style={{ backgroundPosition: `${index * 25}% center` }} role="img" aria-label={`${space.name} with cellular shades`} />
                    <div><h3>{space.name}</h3><p>{space.cardCopy}</p><i aria-hidden="true">↗</i></div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="space-showroom" className={styles.spaceShowroom} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}>
              <div className={styles.spaceHero}>
                <AnimatePresence mode="wait">
                  <motion.div key={selectedSpace} className={styles.spaceHeroImage} initial={{ opacity: 0, scale: 1.015 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}>
                    <Image src={spaces[selectedSpace].image} alt={`${spaces[selectedSpace].name} with recommended Cellular Shades`} fill sizes="(max-width: 900px) 100vw, 72vw" />
                  </motion.div>
                </AnimatePresence>
                <div className={styles.spaceHeroShade} />
                <button className={styles.returnButton} type="button" onClick={() => setSelectedSpace(null)}>VIEW ALL SPACES <span aria-hidden="true">×</span></button>
                <AnimatePresence mode="wait">
                  <motion.div key={`${selectedSpace}-copy`} className={styles.spaceHeroCopy} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.38, delay: 0.08 }}>
                    <span className={styles.kicker}>{spaces[selectedSpace].name.toUpperCase()}</span>
                    <h2>{spaces[selectedSpace].headline}</h2>
                    <p>{spaces[selectedSpace].description}</p>
                    <div className={styles.recommendation}><small>RECOMMENDED FABRIC</small><b>{spaces[selectedSpace].fabric}</b><i>{spaces[selectedSpace].opacity} OPACITY</i></div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className={styles.spacePerformance}>
                <div className={styles.benefits}><span className={styles.kicker}>COMFORT BENEFITS</span>{spaces[selectedSpace].benefits.map((benefit) => <p key={benefit}>{benefit}</p>)}</div>
                <div className={styles.ratingGrid}>
                  {[["Privacy", spaces[selectedSpace].privacy], ["Light Control", spaces[selectedSpace].light], ["Thermal Comfort", spaces[selectedSpace].thermal], ["Noise Reduction", spaces[selectedSpace].noise]].map(([label, rating]) => (
                    <div key={label as string}><span>{label}</span><b aria-label={`${rating} out of 5`}>{"★".repeat(rating as number)}<i>{"★".repeat(5 - (rating as number))}</i></b></div>
                  ))}
                </div>
              </div>
              <button className={styles.exploreAnother} type="button" onClick={() => setSelectedSpace((selectedSpace + 1) % spaces.length)}>
                <span>COMPARE ANOTHER SPACE</span><b>{spaces[(selectedSpace + 1) % spaces.length].name}</b><i aria-hidden="true">→</i>
              </button>
              <div className={styles.spaceSelector} role="tablist" aria-label="Choose a room">
                {spaces.map((space, index) => <button key={space.name} type="button" role="tab" aria-selected={selectedSpace === index} onClick={() => setSelectedSpace(index)}>{space.name}</button>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className={styles.finalCta}>
        <Image src="/images/cellular-hero-winter.webp" alt="Comfortable bedroom protected by insulating cellular shades" fill sizes="100vw" />
        <div className={styles.finalShade} />
        <Fade className={styles.finalContent}>
          <span className={styles.kicker}>COMFORT, TAILORED TO YOUR SPACE</span>
          <h2>Engineered for comfort.<br /><em>Designed for you.</em></h2>
          <p>Let&apos;s create a quieter, more comfortable home—beautifully considered from the first measurement to the final installation.</p>
          <a className="button button-gold" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">SCHEDULE A CONSULTATION</a>
        </Fade>
      </section>

      <SiteFooter />
    </main>
  );
}
