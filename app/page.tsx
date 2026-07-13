"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import styles from "./home.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) { return <NextImage {...props} unoptimized />; }
function Fade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .76, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

const heroSlides = [
  { image: "/images/hero.png", label: "Motorized Roller Shades" },
  { image: "/images/smart-film-hero-v2.png", label: "Smart Film" },
  { image: "/images/drapery-hero-sheer.png", label: "Custom Drapery" },
  { image: "/images/cellular-hero-winter.webp", label: "Cellular Shades" },
];

const solutions = [
  { key: "film", name: "Smart Film", copy: "Instant privacy on demand. Transform glass without interrupting the architecture.", image: "/images/smart-film.png", href: "/solutions/smart-film" },
  { key: "roller", name: "Motorized Roller Shades", copy: "Quiet, precise control of daylight, privacy, glare, and comfort.", image: "/images/hero.png", href: "/solutions/roller-shades" },
  { key: "drapery", name: "Custom Drapery", copy: "Bespoke fabrics, refined folds, and softness tailored to every interior.", image: "/images/drapery-hero-sheer.png", href: "/solutions/custom-drapery" },
  { key: "cellular", name: "Cellular Shades", copy: "Thermal comfort, gentle privacy, and energy efficiency for everyday living.", image: "/images/cellular-hero-winter.webp", href: "/solutions/cellular-shades" },
];

const spaces = [
  { name: "Miami Waterfront", location: "Miami Beach", type: "Waterfront Residence", image: "/images/smart-film.png", ratings: [["Smart Film",5],["Motorized Roller Shades",4],["Custom Drapery",5],["Cellular Shades",2]] as [string,number][], combination: "Smart Film + Ripple Fold Linen Drapery", items: [["Smart Film","/images/smart-film.png"],["Ripple Fold Drapery","/images/drapery-room-linen.png"]], reasoning: "For a waterfront residence, preserving panoramic views is essential. Smart Film provides instant privacy without permanently blocking the scenery, while full-height linen drapery adds warmth, acoustic comfort, and architectural elegance.", bestFor: ["Waterfront Homes","Floor-to-Ceiling Glass","Luxury Living Rooms","Open Architecture"] },
  { name: "Brickell Residence", location: "Brickell", type: "High-Rise Residence", image: "/images/hero.png", ratings: [["Smart Film",4],["Motorized Roller Shades",5],["Custom Drapery",4],["Cellular Shades",3]] as [string,number][], combination: "Motorized Screen Shades + Sheer Drapery", items: [["Screen Shades","/images/roller-shades-demo-room.png"],["Sheer Drapery","/images/drapery-hero-sheer.png"]], reasoning: "High-rise glass invites extraordinary daylight but also creates glare and solar heat. Motorized Screen Shades provide precise daily control while preserving the skyline. Sheer drapery softens the architecture after sunset.", bestFor: ["High-Rise Homes","Panoramic Views","Afternoon Sun","Smart Living"] },
  { name: "Coral Gables Home", location: "Coral Gables", type: "Luxury Residence", image: "/images/drapery-room-linen.png", ratings: [["Smart Film",2],["Motorized Roller Shades",3],["Custom Drapery",5],["Cellular Shades",4]] as [string,number][], combination: "Tailored Linen Drapery + Cellular Shades", items: [["Linen Drapery","/images/drapery-room-linen.png"],["Cellular Shades","/images/cellular-compare-with.webp"]], reasoning: "Layered residential architecture benefits from materials that add softness and warmth. Full-height linen drapery creates elegant scale, while Cellular Shades provide discreet insulation and flexible privacy behind the textile layer.", bestFor: ["Layered Interiors","Garden Views","Formal Living","Acoustic Comfort"] },
  { name: "Quiet Primary Suite", location: "Coconut Grove", type: "Primary Bedroom", image: "/images/cellular-hero-winter.webp", ratings: [["Smart Film",2],["Motorized Roller Shades",4],["Custom Drapery",4],["Cellular Shades",5]] as [string,number][], combination: "Room-Darkening Cellular Shades + Drapery", items: [["Cellular Shades","/images/cellular-hero-winter.webp"],["Blackout Drapery","/images/drapery-room-blackout.png"]], reasoning: "A primary suite should protect rest before anything else. Room-darkening Cellular Shades deliver thermal stability, reduced noise, and reliable light control. Drapery completes the composition with softness and deeper privacy.", bestFor: ["Primary Suites","Restful Sleep","Thermal Comfort","Quiet Interiors"] },
  { name: "Downtown Workplace", location: "Downtown Miami", type: "Commercial Office", image: "/images/commercial.png", ratings: [["Smart Film",5],["Motorized Roller Shades",5],["Custom Drapery",2],["Cellular Shades",3]] as [string,number][], combination: "Smart Film + Motorized Screen Shades", items: [["Smart Film","/images/commercial-smart-film-cover-v3.png"],["Screen Shades","/images/commercial.png"]], reasoning: "Modern workplaces need to move quickly between openness and discretion. Smart Film creates instant meeting-room privacy, while Motorized Screen Shades reduce glare and heat across exterior glazing.", bestFor: ["Executive Offices","Meeting Rooms","Glass Partitions","Flexible Workplaces"] },
];

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const panelCloseRef = useRef<HTMLButtonElement>(null);
  const panelScrollRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 760], [0, 48]);
  const activeSpace = selectedSpace === null ? null : spaces[selectedSpace];
  const panelOpen = selectedSpace !== null;

  useEffect(() => { const timer = window.setInterval(() => setHeroIndex((value) => (value + 1) % heroSlides.length), 9000); return () => window.clearInterval(timer); }, []);

  const closePanel = () => { setSelectedSpace(null); window.setTimeout(() => triggerRef.current?.focus(), 0); };
  useEffect(() => {
    if (!panelOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelCloseRef.current?.focus();
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") closePanel(); };
    const pointer = (event: PointerEvent) => { const target = event.target as Node; if (!panelRef.current?.contains(target) && !cardsRef.current?.parentElement?.contains(target)) closePanel(); };
    window.addEventListener("keydown", keydown); window.addEventListener("pointerdown", pointer);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", keydown); window.removeEventListener("pointerdown", pointer); };
  }, [panelOpen]);
  useEffect(() => { if (selectedSpace !== null) panelScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }, [selectedSpace]);

  return (
    <main className={styles.home}>
      <SiteHeader />

      <section className={styles.hero} id="top">
        <AnimatePresence initial={false}>
          <motion.div key={heroSlides[heroIndex].image} className={styles.heroMedia} style={{ y: heroY }} initial={{ opacity: 0, scale: 1.055, x: heroIndex % 2 === 0 ? 8 : -8 }} animate={{ opacity: 1, scale: 1.012, x: 0 }} exit={{ opacity: 0, scale: 1, x: heroIndex % 2 === 0 ? -5 : 5 }} transition={{ opacity: { duration: 1.9, ease: [0.22, 1, 0.36, 1] }, scale: { duration: 9, ease: "linear" }, x: { duration: 9, ease: [0.22, 1, 0.36, 1] } }}><Image src={heroSlides[heroIndex].image} alt={`${heroSlides[heroIndex].label} in a luxury architectural interior`} fill priority sizes="100vw" /></motion.div>
        </AnimatePresence>
        <div className={styles.heroShade} />
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .95, ease: [0.22, 1, 0.36, 1] }}>
          <h1>Designed around<br />the way you live.</h1>
          <p>Smart Film, Motorized Shades and Custom Drapery designed for Miami&apos;s most refined residential and commercial spaces.</p>
          <div className={styles.buttonRow}><a className="button button-gold" href="#contact">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="/solutions">EXPLORE OUR SOLUTIONS</a></div>
        </motion.div>
        <div className={styles.heroControls}><div>{heroSlides.map((slide,index) => <button type="button" key={slide.label} aria-label={`Show ${slide.label}`} aria-pressed={heroIndex === index} onClick={() => setHeroIndex(index)} />)}</div><button type="button" onClick={() => setHeroIndex((heroIndex - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous hero image">←</button><button type="button" onClick={() => setHeroIndex((heroIndex + 1) % heroSlides.length)} aria-label="Next hero image">→</button></div>
      </section>

      <section className={styles.trust} aria-label="Trusted technology partners"><p>TRUSTED BY INDUSTRY-LEADING BRANDS</p><div><b>somfy.</b><b>SMARTTINT®</b><b>LUTRON.</b><b className={styles.serif}>ALTA</b><b>mecho</b></div></section>

      <section className={styles.intro} id="about">
        <Fade className={styles.introCopy}><span className={styles.kicker}>ABOUT LUMINIX SHADES</span><h2>Intelligent solutions.<br />Timeless spaces.</h2><p>We combine thoughtful design, advanced technology, expert craftsmanship, and precise architectural integration to create environments that feel effortless, comfortable, and complete.</p><a className={styles.textLink} href="/about">LEARN MORE ABOUT US <span>→</span></a></Fade>
        <div className={styles.introImage}><Image src="/images/architecture.png" alt="Refined architectural interior shaped by light" fill sizes="(max-width: 760px) 100vw, 54vw" /></div>
      </section>

      <section className={styles.solutions} id="solutions">
        <Fade className={styles.sectionHeading}><div><span className={styles.kicker}>EXPLORE OUR SOLUTIONS</span><h2>Every space. Every need.<br />The perfect solution.</h2></div><a className={styles.textLink} href="/solutions">VIEW ALL SOLUTIONS <span>→</span></a></Fade>
        <div className={styles.solutionGrid}>{solutions.map((item) => <motion.a className={`${styles.solutionCard} ${styles[item.key]}`} href={item.href} key={item.name}><div className={styles.solutionImage}><Image src={item.image} alt={`${item.name} installation`} fill sizes="(max-width:760px) 100vw, 25vw" /></div><div className={styles.solutionBody}><span className={styles.miniIcon} aria-hidden="true" /><h3>{item.name}</h3><p>{item.copy}</p><strong>EXPLORE {item.name.toUpperCase()} <b>→</b></strong></div></motion.a>)}</div>
      </section>

      <section className={styles.markets}>
        <article><Image src="/images/residential.png" alt="Luxury residential window solutions" fill sizes="(max-width:760px) 100vw, 50vw" /><div><span>RESIDENTIAL</span><h2>Homes designed<br />for the way you live.</h2><a href="/solutions#finder">EXPLORE RESIDENTIAL →</a></div></article>
        <article><Image src="/images/commercial.png" alt="Premium commercial window solutions" fill sizes="(max-width:760px) 100vw, 50vw" /><div><span>COMMERCIAL</span><h2>Solutions for every<br />business environment.</h2><a href="/solutions#finder">EXPLORE COMMERCIAL →</a></div></article>
      </section>

      <section className={styles.process} id="process">
        <Fade className={styles.processTitle}><span className={styles.kicker}>OUR PROCESS</span><h2>A seamless experience<br />from start to finish.</h2></Fade>
        {[["01","Consultation","We understand your needs and your space."],["02","Design & Measurement","Custom recommendations and precise measurements."],["03","Custom Production","Expert craftsmanship using premium materials."],["04","Professional Installation","Flawless installation with attention to every detail."]].map(([number,title,copy]) => <Fade className={styles.processStep} key={number}><strong>{number}</strong><i className={`${styles.processIcon} ${styles[`icon${number}`]}`} aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></Fade>)}
      </section>

      <section className={`${styles.spaces} ${panelOpen ? styles.spacesPanelOpen : ""}`} id="projects">
        <Fade className={styles.spacesHeading}><div><span className={styles.kicker}>INSPIRED BY REAL SPACES</span><h2>See what works best<br />for spaces like yours.</h2></div><a className={styles.textLink} href="/solutions#projects">VIEW ALL SPACES <span>→</span></a></Fade>
        <div className={styles.spaceGallery}><div ref={cardsRef} className={styles.spaceCards}>{spaces.map((space,index) => <motion.button type="button" key={space.name} className={selectedSpace === index ? styles.activeSpace : ""} aria-pressed={selectedSpace === index} onClick={(event) => { triggerRef.current = event.currentTarget; setSelectedSpace(index); }}><div className={styles.spaceImage}><Image src={space.image} alt={`${space.name} in ${space.location}`} fill sizes="(max-width:760px) 86vw, 20vw" /></div><div className={styles.spaceCardCopy}><h3>{space.name}</h3><p>{space.location} · {space.type}</p><span>Recommended Combination</span><strong>{space.combination}</strong><div className={styles.spaceRatings}>{space.ratings.map(([name,score]) => <small key={name}><b>{name}</b><i>{"★".repeat(score)}<em>{"☆".repeat(5-score)}</em></i></small>)}</div></div></motion.button>)}</div><div className={styles.spaceNav}><button type="button" onClick={() => cardsRef.current?.scrollBy({ left: -280, behavior: "smooth" })} aria-label="Previous spaces">←</button><i /><button type="button" onClick={() => cardsRef.current?.scrollBy({ left: 280, behavior: "smooth" })} aria-label="Next spaces">→</button></div></div>
      </section>

      <section className={styles.service} id="areas"><div className={styles.serviceIntro}><span>SERVING MIAMI<br />& SOUTH FLORIDA</span><p>Proudly serving Miami and surrounding communities with tailored window solutions.</p><a className={styles.textLink} href="/#contact">VIEW SERVICE AREAS <b>→</b></a></div><div className={styles.cities}>{["Miami","Coconut Grove","Fort Lauderdale","Miami Beach","Key Biscayne","Palm Beach","Brickell","Aventura","Boca Raton","Coral Gables","Sunny Isles","And more"].map((city) => <span key={city}>{city}</span>)}</div><div className={styles.serviceImage}><Image src="/images/residential-smart-film-cover-v3.png" alt="South Florida residential architecture" fill sizes="(max-width:760px) 100vw, 35vw" /></div></section>

      <section className={styles.finalCta} id="contact"><div><h2>Let&apos;s design the right solution<br />for your space.</h2><p>Begin with a design consultation tailored to your architecture, lifestyle, privacy, and comfort.</p><div className={styles.buttonRow}><a className="button button-gold" href="mailto:hello@luminixshades.com">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="mailto:hello@luminixshades.com">REQUEST A QUOTE</a></div></div></section>

      <SiteFooter />

      <AnimatePresence>{activeSpace && <motion.div className={styles.panelOverlay} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}><motion.aside ref={panelRef} className={styles.panel} role="dialog" aria-modal="false" aria-labelledby="home-panel-title" initial={{ opacity:0,x:46 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:34 }} transition={{ duration:.34,ease:[.22,1,.36,1] }}><button ref={panelCloseRef} type="button" className={styles.panelClose} onClick={closePanel} aria-label="Close recommendations">×</button><div ref={panelScrollRef} className={styles.panelScroll}><AnimatePresence mode="wait" initial={false}><motion.div key={activeSpace.name} initial={{ opacity:0,x:10 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-8 }} transition={{ duration:.3 }}><span className={styles.kicker}>RECOMMENDATION FOR THIS SPACE</span><h2 id="home-panel-title">{activeSpace.name}</h2><p className={styles.panelMeta}>{activeSpace.location} <b>·</b> {activeSpace.type}</p><div className={styles.panelHero}><Image src={activeSpace.image} alt={`${activeSpace.name} recommendation`} fill sizes="(max-width:760px) 100vw, 520px" /></div><section><h3>RECOMMENDED SOLUTIONS</h3><div className={styles.panelRatings}>{activeSpace.ratings.map(([name,score]) => <div key={name}><span>{name}</span><i>{"★".repeat(score)}<em>{"☆".repeat(5-score)}</em></i></div>)}</div></section><section><h3>WHY WE RECOMMEND THIS</h3><p>{activeSpace.reasoning}</p></section><section><h3>BEST FOR</h3><div className={styles.bestFor}>{activeSpace.bestFor.map((item,index) => <div key={item}><i>{["⌂","□","◇","⌗"][index]}</i><span>{item}</span></div>)}</div></section><section><h3>RECOMMENDED COMBINATION</h3><div className={styles.combo}>{activeSpace.items.map(([label,image],index) => <div key={label}><figure><Image src={image} alt="" fill sizes="100px" /></figure><span>{label}</span>{index === 0 && <b>+</b>}</div>)}</div></section><a className="button button-gold" href="mailto:hello@luminixshades.com">SCHEDULE A DESIGN CONSULTATION</a><button type="button" className={styles.exploreAnother} onClick={closePanel}>EXPLORE ANOTHER SPACE ←</button></motion.div></AnimatePresence></div></motion.aside></motion.div>}</AnimatePresence>
    </main>
  );
}
