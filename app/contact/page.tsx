"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { BUSINESS } from "../lib/business";
import styles from "./contact.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
const faq = [
  ["Do you offer consultations?", "Yes. Consultations are tailored to the space, desired level of privacy, light control, and architectural requirements. Any applicable consultation details are confirmed when scheduling."],
  ["Can you visit my home or business?", "Luminix works with residential and commercial environments throughout South Florida. Site-visit availability is confirmed based on location and project scope."],
  ["Do you install throughout South Florida?", "Our service area includes Miami-Dade, Broward, and Palm Beach communities. Contact us to confirm availability for your address."],
  ["Can Smart Film be installed on existing glass?", "Many existing glass surfaces may be suitable. Glass type, dimensions, condition, wiring access, and intended performance are reviewed before a recommendation is made."],
  ["How long does installation take?", "Timing varies by product, quantity, customization, site readiness, and access. A project-specific schedule is provided after the scope is confirmed."],
  ["Do you offer motorized and smart-home integrations?", "Yes. Motorized shading can be planned around compatible wall controls, remotes, apps, and selected automation ecosystems."],
  ["Can I submit photos before the consultation?", "Yes. The Plan Your Project experience accepts project details and reference photos so the team can prepare for a more productive conversation."],
] as const;

function track(event: string) { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("luminix:analytics", { detail: { event } })); }

function LineIcon({ type }: { type: "place" | "phone" | "email" | "calendar" }) {
  return <span className={`${styles.lineIcon} ${styles[type]}`} aria-hidden="true"><i /></span>;
}

export default function ContactPage() {
  const reduced = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeArea, setActiveArea] = useState("Miami");
  const transition = { duration: reduced ? 0 : .75, ease };

  return <main className={styles.page}>
    <SiteHeader />
    <section className={styles.hero}>
      <motion.div className={styles.heroMedia} initial={{ opacity: .55, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 1.4, ease }}><Image src="/images/solutions-showroom-hero-v2.webp" alt="Contemporary South Florida residence with panoramic waterfront glazing" fill priority sizes="100vw" /></motion.div>
      <div className={styles.heroShade} />
      <div className={styles.heroCopy}>
        <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={transition}>CONTACT US</motion.span>
        <motion.h1 initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduced ? 0 : .12 }}>We&apos;re here<br />to help.</motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduced ? 0 : .22 }}>Whether you have a question, need support, or simply want to connect with our team, we&apos;d love to hear from you.</motion.p>
        <i />
      </div>
    </section>

    <section className={styles.options} aria-label="Contact options">
      <article><LineIcon type="place" /><h2>Meet With<br />Our Team</h2><p>Private consultations are arranged by appointment throughout South Florida.</p><figure><Image src="/images/architecture.png" alt="Refined Luminix consultation setting" fill sizes="(max-width:760px) 100vw, 25vw" /></figure><a href={BUSINESS.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("consultation_schedule_clicked")}>ARRANGE A MEETING <b>→</b></a></article>
      <article><LineIcon type="phone" /><h2>Call Us</h2>{BUSINESS.phone ? <><strong>{BUSINESS.phone}</strong><p>Speak directly with the Luminix team.</p><a href={`tel:${BUSINESS.phone.replace(/[^+\d]/g, "")}`} onClick={() => track("contact_phone_clicked")}>CALL NOW <b>→</b></a></> : <><p>Direct telephone details are provided when a consultation or support conversation is arranged.</p><a href={BUSINESS.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("consultation_schedule_clicked")}>SCHEDULE A CALL <b>→</b></a></>}</article>
      <article><LineIcon type="email" /><h2>Email Us</h2><strong>{BUSINESS.email}</strong><p>We&apos;ll respond as soon as possible.</p><a href={`mailto:${BUSINESS.email}?subject=General%20Inquiry%20%E2%80%94%20Luminix%20Shades`} onClick={() => track("contact_email_clicked")}>SEND EMAIL <b>→</b></a></article>
      <article><LineIcon type="calendar" /><h2>Schedule a<br />Consultation</h2><p>Book a personalized consultation with our shading experts.</p><a className={styles.darkAction} href={BUSINESS.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("consultation_schedule_clicked")}>SCHEDULE NOW <b>→</b></a></article>
    </section>

    <section className={styles.service}>
      <div className={styles.serviceCopy}><span>SERVICE AREA</span><h2>Proudly serving<br />South Florida.</h2><i /><div>{BUSINESS.serviceAreas.map(area => <button type="button" key={area.name} className={activeArea === area.name ? styles.activeCity : ""} onMouseEnter={() => setActiveArea(area.name)} onFocus={() => { setActiveArea(area.name); track("service_area_interacted"); }} onClick={() => { setActiveArea(area.name); track("service_area_interacted"); }}><b aria-hidden="true">⌖</b>{area.name}</button>)}</div></div>
      <div className={styles.map} aria-label="Interactive map of Luminix Shades service areas in South Florida">
        <Image src="/images/south-florida-basemap.webp" alt="Geographic road map of South Florida from Miami through Palm Beach" fill sizes="(max-width:850px) 100vw, 58vw" />
        <div className={styles.mapTint} />
        {BUSINESS.serviceAreas.map(area => <button type="button" key={area.name} style={{ left: `${area.x}%`, top: `${area.y}%` }} className={activeArea === area.name ? styles.activeMarker : ""} aria-label={`${area.name}, Luminix service area`} onClick={() => { setActiveArea(area.name); track("service_area_interacted"); }}><i /><span>{area.name}</span></button>)}
        <small>Map shows active service areas and does not represent completed-project locations.</small>
      </div>
    </section>

    <section className={styles.info}>
      <div className={styles.hours}><figure><Image src="/images/commercial-building.png" alt="Contemporary South Florida architectural exterior" fill sizes="(max-width:760px) 100vw, 18vw" /></figure><div><span>BUSINESS HOURS</span><h2>Available by appointment.</h2><dl><div><dt>Monday – Friday</dt><dd>{BUSINESS.hours.weekdays ?? "Hours to be confirmed"}</dd></div><div><dt>Saturday</dt><dd>{BUSINESS.hours.saturday ?? "Hours to be confirmed"}</dd></div><div><dt>Sunday</dt><dd>{BUSINESS.hours.sunday}</dd></div></dl><p>Consultations may be available outside regular business hours by appointment.</p></div></div>
      <div className={styles.faq}><span>FREQUENTLY ASKED QUESTIONS</span>{faq.map(([question, answer], index) => { const open = openFaq === index; return <div key={question}><button type="button" aria-expanded={open} aria-controls={`contact-answer-${index}`} onClick={() => { setOpenFaq(open ? null : index); if (!open) track("faq_opened"); }}><b>{question}</b><i>{open ? "−" : "+"}</i></button><AnimatePresence initial={false}>{open && <motion.p id={`contact-answer-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .28 }}>{answer}</motion.p>}</AnimatePresence></div>})}</div>
    </section>

    <section className={styles.finalCta}><Image src="/images/drapery-final-sunset.png" alt="Waterfront interior prepared for a personalized design consultation" fill sizes="100vw" /><div /><section><span>READY TO TRANSFORM YOUR SPACE?</span><h2>Experience a personalized<br />consultation designed around<br />your project.</h2><Link className="button button-gold" href="/plan-your-project" onClick={() => track("plan_project_clicked")}>PLAN YOUR PROJECT <b>→</b></Link></section></section>
    <SiteFooter />
  </main>;
}

