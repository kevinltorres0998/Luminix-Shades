"use client";

import { motion } from "framer-motion";
import NextImage from "next/image";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";

function Image(props: React.ComponentProps<typeof NextImage>) {
  return <NextImage {...props} unoptimized />;
}

const products = [
  { title: "Smart Film", copy: "Privacy on demand. Transform glass instantly.", image: "/images/smart-film.png", link: "EXPLORE SMART FILM" },
  { title: "Motorized Shades", copy: "Intelligent control of light, privacy and temperature.", image: "/images/architecture.png", link: "EXPLORE SHADES" },
  { title: "Custom Drapery", copy: "Bespoke fabrics, refined details and timeless style.", image: "/images/hero.png", link: "EXPLORE DRAPERY" },
  { title: "Blackout Solutions", copy: "Total darkness. Superior comfort. Better rest.", image: "/images/commercial.png", link: "EXPLORE BLACKOUT" },
];

const projects = [
  ["Brickell Penthouse", "Smart Film", "/images/smart-film.png"],
  ["Miami Beach Residence", "Motorized Shades", "/images/hero.png"],
  ["Aventura Residence", "Custom Drapery", "/images/architecture.png"],
  ["Downtown Office", "Smart Film", "/images/commercial.png"],
  ["Luxury Hotel Miami", "Blackout Solutions", "/images/residential.png"],
];

const Fade = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>
);

function ArrowLink({ children }: { children: React.ReactNode }) {
  return <a className="arrow-link" href="#contact">{children}<span aria-hidden="true">→</span></a>;
}

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <Image src="/images/hero.png" alt="Luxury Miami waterfront interior with automated shades" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <Fade className="hero-content">
          <h1>Redefining Light.<br />Elevating Spaces.</h1>
          <p>Smart film, motorized shades and custom drapery designed for Miami&apos;s most refined residential and commercial spaces.</p>
          <div className="button-row"><a className="button button-gold" href="#contact">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="/solutions">EXPLORE OUR SOLUTIONS</a></div>
        </Fade>
      </section>

      <section className="trust" aria-label="Trusted brands"><p>TRUSTED BY INDUSTRY-LEADING BRANDS</p><div><b>somfy.</b><b>SMARTTINT®</b><b>LUTRON.</b><b className="serif">ALTA</b><b>mecho</b></div></section>

      <section className="intro" id="about">
        <Fade className="intro-copy"><h2>Designed for those<br />who value <em>precision</em><br />and <em>elegance.</em></h2><p>Luminix Shades combines luxury design, advanced technology and expert craftsmanship to create intelligent window solutions that enhance comfort, privacy and architectural beauty.</p><ArrowLink>ABOUT LUMINIX SHADES</ArrowLink></Fade>
        <div className="intro-image"><Image src="/images/architecture.png" alt="Contemporary glass residence with precise window treatments" fill sizes="(max-width: 800px) 100vw, 58vw" /></div>
      </section>

      <section className="products" id="solutions">
        {products.map((item, index) => <Fade className="product" key={item.title}><div className="product-image"><Image src={item.image} alt="" fill sizes="(max-width: 800px) 100vw, 25vw" style={{ objectPosition: index === 2 ? "65% center" : "center" }} /></div><div className="product-body"><span className="line-icon" aria-hidden="true">◫</span><div><h3>{item.title}</h3><p>{item.copy}</p><ArrowLink>{item.link}</ArrowLink></div></div></Fade>)}
      </section>

      <section className="smart-film" id="smart-film">
        <Fade className="film-copy"><span className="eyebrow">SMART FILM</span><h2>Privacy at the<br />touch of a button.</h2><ul><li>Instant privacy on demand</li><li>Seamless, modern design</li><li>Integrates with smart automation</li><li>Residential & commercial applications</li><li>UV protection and light control</li></ul><ArrowLink>EXPLORE SMART FILM</ArrowLink></Fade>
        <div className="film-image"><Image src="/images/smart-film.png" alt="Smart film shown clear and private" fill sizes="(max-width: 800px) 100vw, 67vw" /><span className="film-label left">CLEAR</span><span className="film-label right">PRIVACY</span><span className="slider-pill">‹ ›</span></div>
      </section>

      <section className="feature-strip" id="drapery">
        <article><Image src="/images/hero.png" alt="Motorized shades in luxury residence" fill sizes="33vw" /><div><span>MOTORIZED SHADES</span><h3>Effortless control.<br />Designed around<br />your space.</h3><ArrowLink>EXPLORE SHADES</ArrowLink></div></article>
        <article><Image src="/images/architecture.png" alt="Custom drapery in refined residence" fill sizes="33vw" /><div><span>CUSTOM DRAPERY</span><h3>Tailored elegance.<br />Beautiful in every<br />detail.</h3><ArrowLink>EXPLORE DRAPERY</ArrowLink></div></article>
        <article><Image src="/images/residential.png" alt="Cellular shades in warm modern home" fill sizes="33vw" /><div><span>CELLULAR SHADES</span><h3>Intelligent insulation.<br />Enhanced comfort.<br />Energy efficiency.</h3><ArrowLink>EXPLORE CELLULAR SHADES</ArrowLink></div></article>
      </section>

      <section className="markets">
        <article id="residential"><Image src="/images/residential.png" alt="Luxury residential project" fill sizes="50vw" /><div><h2>RESIDENTIAL</h2><p>Homes, condos, penthouses<br />and luxury living spaces.</p><ArrowLink>EXPLORE RESIDENTIAL</ArrowLink></div></article>
        <article id="commercial"><Image src="/images/commercial.png" alt="Luxury commercial project" fill sizes="50vw" /><div><h2>COMMERCIAL</h2><p>Hotels, restaurants, offices<br />and large-scale projects.</p><ArrowLink>EXPLORE COMMERCIAL</ArrowLink></div></article>
      </section>

      <section className="process" id="process">
        <div className="process-title"><span>OUR PROCESS</span><h2>A seamless experience from<br />start to finish.</h2></div>
        {[["01","Consultation","We understand your needs and your space."],["02","Design & Measurement","Custom recommendations and precise measurements."],["03","Custom Production","Expert craftsmanship using premium materials."],["04","Professional Installation","Flawless installation with attention to every detail."]].map(([n,t,c]) => <div className="process-step" key={n}><strong>{n}</strong><div><b>{t}</b><p>{c}</p></div></div>)}
      </section>

      <section className="projects" id="projects">
        <div className="projects-title"><span>FEATURED PROJECTS</span><h2>Spaces we&apos;re<br />proud to transform.</h2><ArrowLink>VIEW GALLERY</ArrowLink></div>
        {projects.map(([title,type,image]) => <article key={title}><div><Image src={image} alt={title} fill sizes="20vw" /></div><b>{title}</b><span>{type}</span></article>)}
      </section>

      <section className="service-area" id="areas">
        <div><span className="eyebrow">SERVING MIAMI<br />& SOUTH FLORIDA</span><p>Proudly serving Miami and surrounding areas with tailored window solutions.</p><ArrowLink>VIEW SERVICE AREAS</ArrowLink></div>
        <div className="city-list"><span>Miami</span><span>Coconut Grove</span><span>Fort Lauderdale</span><span>Miami Beach</span><span>Key Biscayne</span><span>Palm Beach</span><span>Brickell</span><span>Aventura</span><span>Boca Raton</span><span>Coral Gables</span><span>Sunny Isles</span><span>And more</span></div>
        <div className="final-cta" id="contact"><h2>Let&apos;s design the right<br /><em>solution for your space.</em></h2><div className="button-row"><a className="button button-gold" href="mailto:hello@luminixshades.com">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="mailto:hello@luminixshades.com">REQUEST A QUOTE</a></div></div>
      </section>

      <SiteFooter />
    </main>
  );
}
