"use client";

import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { ChangeEvent, DragEvent, FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { BOOKING_URL } from "../lib/booking";
import styles from "./plan-your-project.module.css";

type ProjectType = "Residential" | "Commercial" | "Hospitality" | "New Construction" | "Yacht";
type Solution = "Smart Film" | "Motorized Roller Shades" | "Custom Drapery" | "Cellular Shades";
type Contact = { fullName: string; email: string; phone: string; address: string; city: string; state: string; zip: string; company: string; message: string; preferred: "Phone" | "Text" | "Email" };
type Measurement = { id: number; width: string; height: string; unit: "in" | "cm" };
type Draft = { projectType: ProjectType | ""; solutions: Solution[]; openings: string; timeline: string; measurementStatus: string; measurements: Measurement[]; skipMeasurements: boolean; contact: Contact; maxStep: number };
type UploadItem = { id: string; file: File; url?: string; kind: "image" | "video" | "document"; progress: number; error?: string; storedPathname?: string };

const STORAGE_KEY = "luminix-plan-your-project-v1";
const SUBMISSION_KEY = "luminix-plan-your-project-submission-id";
const steps = ["Project Type", "Solutions", "Project Details", "Upload", "Contact", "Review & Submit"];
const projectTypes: { name: ProjectType; image: string }[] = [
  { name: "Residential", image: "/images/residential.png" },
  { name: "Commercial", image: "/images/commercial-hero-boardroom.png" },
  { name: "Hospitality", image: "/images/about-hospitality.png" },
  { name: "New Construction", image: "/images/residential-architectural-composition.png" },
  { name: "Yacht", image: "/images/drapery-final-sunset.png" },
];
const solutionOptions: { name: Solution; description: string; image: string; effect: string }[] = [
  { name: "Smart Film", description: "Instant privacy. On demand.", image: "/images/smart-film-demo-clear.png", effect: styles.smartFilm },
  { name: "Motorized Roller Shades", description: "Precision light control. Motorized comfort.", image: "/images/roller-shades-demo-room.png", effect: styles.roller },
  { name: "Custom Drapery", description: "Timeless elegance. Beautifully tailored.", image: "/images/drapery-room-linen.png", effect: styles.drapery },
  { name: "Cellular Shades", description: "Insulating efficiency. Complete comfort.", image: "/images/cellular-hero-winter.webp", effect: styles.cellular },
];
const defaultContact: Contact = { fullName: "", email: "", phone: "", address: "", city: "", state: "FL", zip: "", company: "", message: "", preferred: "Email" };

function readDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Draft; } catch { sessionStorage.removeItem(STORAGE_KEY); return null; }
}

function track(event: string, detail: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("luminix:analytics", { detail: { event, ...detail } }));
  const dataLayer = (window as typeof window & { dataLayer?: Record<string, unknown>[] }).dataLayer;
  dataLayer?.push({ event, ...detail });
}

function StepIntro({ number, label, title, copy }: { number: string; label: string; title: string; copy: string }) {
  return <header className={styles.stepIntro}><span>{number}</span><small>{label}</small><h2>{title}</h2><p>{copy}</p></header>;
}

function ChoiceRow({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button className={active ? styles.rowActive : styles.choiceRow} type="button" role="radio" aria-checked={active} onClick={onClick}><i aria-hidden="true" />{children}</button>;
}

export default function ProjectInquiry() {
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [openings, setOpenings] = useState("");
  const [timeline, setTimeline] = useState("");
  const [measurementStatus, setMeasurementStatus] = useState("");
  const [measurements, setMeasurements] = useState<Measurement[]>([{ id: 1, width: "", height: "", unit: "in" }]);
  const [skipMeasurements, setSkipMeasurements] = useState(false);
  const [contact, setContact] = useState<Contact>(defaultContact);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const hydrated = useRef(false);
  const submissionId = useRef("");

  useEffect(() => {
    const draft = readDraft();
    if (!draft) { hydrated.current = true; return; }
    const timer = window.setTimeout(() => {
      setProjectType(draft.projectType || ""); setSolutions(draft.solutions || []); setOpenings(draft.openings || "");
      setTimeline(draft.timeline || ""); setMeasurementStatus(draft.measurementStatus || ""); setMeasurements(draft.measurements?.length ? draft.measurements : [{ id: 1, width: "", height: "", unit: "in" }]);
      setSkipMeasurements(Boolean(draft.skipMeasurements)); setContact({ ...defaultContact, ...draft.contact }); setMaxStep(draft.maxStep || 0);
      hydrated.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated.current || status === "success") return;
    const draft: Draft = { projectType, solutions, openings, timeline, measurementStatus, measurements, skipMeasurements, contact, maxStep };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [projectType, solutions, openings, timeline, measurementStatus, measurements, skipMeasurements, contact, maxStep, status]);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(`.${styles.hero}`);
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const update = () => hero.style.setProperty("--scroll-y", `${Math.min(window.scrollY, 900)}px`);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const observers = steps.map((_, index) => {
      const element = document.getElementById(`project-step-${index + 1}`);
      if (!element) return null;
      const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setCurrentStep(index); }, { rootMargin: "-38% 0px -48%", threshold: 0 });
      observer.observe(element); return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  useEffect(() => () => uploads.forEach((item) => item.url && URL.revokeObjectURL(item.url)), [uploads]);

  const previewImage = useMemo(() => {
    if (projectType === "Commercial") return "/images/commercial-hero-boardroom.png";
    if (projectType === "Hospitality") return "/images/about-hospitality.png";
    if (projectType === "Yacht") return "/images/drapery-final-sunset.png";
    return "/images/hero.png";
  }, [projectType]);

  const scrollToStep = (step: number) => document.getElementById(`project-step-${step + 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const advance = (from: number) => { setMaxStep((value) => Math.max(value, from + 1)); scrollToStep(from + 1); };
  const updateContact = (key: keyof Contact, value: string) => setContact((current) => ({ ...current, [key]: key === "preferred" ? value as Contact["preferred"] : value }));
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    return digits.length > 6 ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}` : digits.length > 3 ? `(${digits.slice(0, 3)}) ${digits.slice(3)}` : digits;
  };

  const addFiles = (files: FileList | File[]) => {
    const accepted = Array.from(files).slice(0, Math.max(0, 10 - uploads.length)).map((file) => {
      const validType = file.type.startsWith("image/") || file.type.startsWith("video/") || file.type === "application/pdf";
      const tooLarge = file.size > 25 * 1024 * 1024;
      const kind = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document";
      return { id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, file, kind, progress: 0, error: !validType ? "Unsupported file type" : tooLarge ? "File exceeds 25 MB" : undefined, url: kind === "image" && validType && !tooLarge ? URL.createObjectURL(file) : undefined } as UploadItem;
    });
    setUploads((current) => [...current, ...accepted]);
    if (accepted.some((item) => !item.error)) track("project_file_uploaded", { count: accepted.filter((item) => !item.error).length });
  };

  const validateContact = () => {
    if (!contact.fullName.trim()) return "fullName";
    if (!/^\S+@\S+\.\S+$/.test(contact.email)) return "email";
    if (contact.phone.replace(/\D/g, "").length < 10) return "phone";
    if (!contact.address.trim()) return "address";
    if (!contact.city.trim()) return "city";
    if (!/^\d{5}(?:-\d{4})?$/.test(contact.zip)) return "zip";
    return "";
  };

  const goToReview = () => {
    const invalid = validateContact();
    if (invalid) { document.getElementById(invalid)?.focus(); setError("Please complete the required contact fields."); track("project_form_error", { step: 5 }); return; }
    setError(""); track("contact_step_completed"); advance(4);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError("");
    if (!projectType) { scrollToStep(0); setError("Choose a project type to continue."); return; }
    if (!solutions.length) { scrollToStep(1); setError("Choose at least one solution."); return; }
    if (!openings || !timeline || !measurementStatus) { scrollToStep(2); setError("Complete the project details to continue."); return; }
    const invalid = validateContact();
    if (invalid) { scrollToStep(4); window.setTimeout(() => document.getElementById(invalid)?.focus(), 450); setError("Please complete the required contact fields."); return; }
    if (!consent) { document.getElementById("privacy-consent")?.focus(); setError("Please accept the Privacy Policy before submitting."); return; }
    setStatus("submitting");
    try {
      if (!submissionId.current) {
        submissionId.current = sessionStorage.getItem(SUBMISSION_KEY) || crypto.randomUUID();
        sessionStorage.setItem(SUBMISSION_KEY, submissionId.current);
      }
      const validUploads = uploads.filter((item) => !item.error);
      const storedFiles = [] as { name: string; pathname: string }[];
      for (const item of validUploads) {
        if (item.storedPathname) { storedFiles.push({ name: item.file.name, pathname: item.storedPathname }); continue; }
        const safeName = item.file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120) || "project-file";
        const result = await upload(`project-inquiries/${submissionId.current}/${safeName}`, item.file, { access: "private", handleUploadUrl: "/api/project-inquiries/upload", clientPayload: submissionId.current, onUploadProgress: ({ percentage }) => setUploads((current) => current.map((file) => file.id === item.id ? { ...file, progress: Math.round(percentage) } : file)) });
        setUploads((current) => current.map((file) => file.id === item.id ? { ...file, storedPathname: result.pathname, progress: 100 } : file));
        storedFiles.push({ name: item.file.name, pathname: result.pathname });
      }
      const params = new URLSearchParams(window.location.search);
      const utm = Object.fromEntries(Array.from(params.entries()).filter(([key]) => key.startsWith("utm_")));
      const response = await fetch("/api/project-inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submissionId: submissionId.current, projectType, solutions, details: { openings, timeline, measurementStatus, measurements: skipMeasurements ? [] : measurements, exactMeasurementsPending: skipMeasurements }, contact, files: storedFiles, source: "/plan-your-project", referrer: document.referrer, utm, website: honeypot }) });
      const result = await response.json().catch(() => null) as { ok?: boolean; error?: { message?: string } } | null;
      if (!response.ok || !result?.ok) throw new Error(result?.error?.message || "Submission unavailable");
      sessionStorage.removeItem(STORAGE_KEY); sessionStorage.removeItem(SUBMISSION_KEY); setStatus("success"); track("project_form_submitted", { solutionCount: solutions.length }); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submissionError) { setStatus("error"); setError(submissionError instanceof Error && submissionError.message !== "Submission unavailable" ? submissionError.message : "We couldn’t securely submit your project just now. Your information is still here—please try again."); track("project_form_error", { step: 6 }); }
  };

  const startOver = () => {
    if (!window.confirm("Start over and clear your saved project details?")) return;
    sessionStorage.removeItem(STORAGE_KEY); sessionStorage.removeItem(SUBMISSION_KEY); submissionId.current = ""; uploads.forEach((item) => item.url && URL.revokeObjectURL(item.url));
    setProjectType(""); setSolutions([]); setOpenings(""); setTimeline(""); setMeasurementStatus(""); setMeasurements([{ id: 1, width: "", height: "", unit: "in" }]); setSkipMeasurements(false); setContact(defaultContact); setUploads([]); setConsent(false); setMaxStep(0); setStatus("idle"); setError(""); scrollToStep(0);
  };

  if (status === "success") return <main className={styles.confirmation}><div><div className={styles.successLogo}><Image src="/images/logo-white.png" alt="Luminix Shades" width={330} height={94} unoptimized /><span><Image src="/images/logo-white.png" alt="" width={330} height={94} unoptimized /></span></div><span>THANK YOU</span><h1>Your project has been received.</h1><p>A Luminix specialist will review your information and contact you shortly.</p><div><a className="button button-gold" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={() => track("consultation_scheduling_opened")}>SCHEDULE YOUR CONSULTATION</a><a className="button button-outline" href="/solutions">RETURN TO THE SHOWROOM</a></div></div></main>;

  return <main className={styles.page}>
    <section className={styles.hero} id="top"><div className={styles.heroImage}><Image src="/images/hero.png" alt="Contemporary Miami residence overlooking the water at dusk" fill priority sizes="100vw" /></div><div className={styles.heroShade} /><div className={styles.glassPanel}><span>PLAN YOUR PROJECT</span><h1><i>Every exceptional</i><i>space begins with</i><i>a conversation.</i></h1><p>A few details are all we need to prepare a personalized recommendation for your project.</p><a className="button button-gold" href="#project-step-1" onClick={() => track("plan_project_started")}>START YOUR PROJECT <b>→</b></a><a className={styles.scrollCue} href="#project-step-1"><b>↓</b> SCROLL TO BEGIN</a></div></section>

    <nav className={styles.progress} aria-label="Project inquiry progress"><div className={styles.mobileProgress}><span>{String(currentStep + 1).padStart(2, "0")} — {steps[currentStep]}</span><small>Step {currentStep + 1} of 6</small><i><b style={{ width: `${((currentStep + 1) / 6) * 100}%` }} /></i></div><div className={styles.desktopProgress}>{steps.map((label, index) => <button key={label} type="button" disabled={index > maxStep} className={index === currentStep ? styles.progressActive : index < currentStep ? styles.progressComplete : ""} onClick={() => scrollToStep(index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{label}</b><i /></button>)}</div></nav>

    <form onSubmit={submit} noValidate>
      <section className={styles.step} id="project-step-1"><StepIntro number="01" label="PROJECT TYPE" title="What are we designing?" copy="Select the environment that best represents your project." /><fieldset className={styles.projectMosaic}><legend className={styles.srOnly}>Choose one project type</legend>{projectTypes.map((item) => <label key={item.name} className={`${styles.projectCard} ${projectType === item.name ? styles.selected : ""}`}><input className={styles.srOnly} type="radio" name="projectType" checked={projectType === item.name} onChange={() => { setProjectType(item.name); setMaxStep((v) => Math.max(v, 1)); track("project_type_selected", { type: item.name }); }} /><Image src={item.image} alt={`${item.name} project`} fill sizes="(max-width: 760px) 100vw, 35vw" /><span>{item.name}</span><i aria-hidden="true">✓</i></label>)}</fieldset><div className={styles.stepAction}><button type="button" disabled={!projectType} onClick={() => advance(0)}>CONTINUE <span>→</span></button></div></section>

      <section className={styles.step} id="project-step-2"><StepIntro number="02" label="SOLUTIONS" title="Which products interest you?" copy="Select all that apply." /><fieldset className={styles.solutionGrid}><legend className={styles.srOnly}>Choose one or more solutions</legend>{solutionOptions.map((item) => { const active = solutions.includes(item.name); return <label key={item.name} className={`${styles.solutionCard} ${item.effect} ${active ? styles.selected : ""}`}><input className={styles.srOnly} type="checkbox" checked={active} onChange={() => { setSolutions((current) => active ? current.filter((name) => name !== item.name) : [...current, item.name]); track("solution_selected", { solution: item.name, selected: !active }); }} /><div><Image src={item.image} alt={item.name} fill sizes="(max-width: 760px) 82vw, 24vw" /></div><span><b>{item.name}</b><small>{item.description}</small></span><i aria-hidden="true">✓</i></label>; })}</fieldset><div className={styles.stepAction}><button type="button" disabled={!solutions.length} onClick={() => advance(1)}>NEXT STEP <span>→</span></button></div></section>

      <section className={styles.step} id="project-step-3"><StepIntro number="03" label="PROJECT DETAILS" title="Tell us about your project." copy="A few practical details help us prepare the right recommendation." /><div className={styles.detailsGrid}><fieldset className={styles.selectionPanel}><legend>How many openings?</legend>{["1–5", "6–10", "11–20", "20+"].map((item) => <ChoiceRow key={item} active={openings === item} onClick={() => setOpenings(item)}>{item}</ChoiceRow>)}</fieldset><fieldset className={styles.selectionPanel}><legend>Project timeline</legend>{["Immediately", "Within 30 days", "Planning stage", "Not sure yet"].map((item) => <ChoiceRow key={item} active={timeline === item} onClick={() => setTimeline(item)}>{item}</ChoiceRow>)}</fieldset><fieldset className={styles.selectionPanel}><legend>Measurements</legend>{["I have measurements", "I need measurements"].map((item) => <ChoiceRow key={item} active={measurementStatus === item} onClick={() => setMeasurementStatus(item)}>{item}</ChoiceRow>)}{measurementStatus === "I need measurements" && <p className={styles.reassurance}>We’ll take care of it during your consultation.</p>}</fieldset><LivePreview image={previewImage} projectType={projectType} solutions={solutions} /></div>{measurementStatus === "I have measurements" && <div className={styles.measurementArea}><div><span>OPTIONAL MEASUREMENTS</span><p>Add what you know now, or continue without exact dimensions.</p></div>{!skipMeasurements && measurements.map((measurement, index) => <div className={styles.measurementRow} key={measurement.id}><b>Opening {index + 1}</b><label>Width<input inputMode="decimal" value={measurement.width} onChange={(event) => setMeasurements((current) => current.map((item) => item.id === measurement.id ? { ...item, width: event.target.value.replace(/[^0-9.]/g, "") } : item))} /></label><label>Height<input inputMode="decimal" value={measurement.height} onChange={(event) => setMeasurements((current) => current.map((item) => item.id === measurement.id ? { ...item, height: event.target.value.replace(/[^0-9.]/g, "") } : item))} /></label><label>Unit<select value={measurement.unit} onChange={(event) => setMeasurements((current) => current.map((item) => item.id === measurement.id ? { ...item, unit: event.target.value as "in" | "cm" } : item))}><option value="in">Inches</option><option value="cm">Centimeters</option></select></label>{measurements.length > 1 && <button type="button" onClick={() => setMeasurements((current) => current.filter((item) => item.id !== measurement.id))}>Remove</button>}</div>)}<div className={styles.measurementActions}><button type="button" disabled={skipMeasurements} onClick={() => setMeasurements((current) => [...current, { id: Date.now(), width: "", height: "", unit: "in" }])}>+ ADD ANOTHER OPENING</button><button type="button" className={skipMeasurements ? styles.skipActive : ""} onClick={() => setSkipMeasurements((value) => !value)}>{skipMeasurements ? "✓ " : ""}I DON’T HAVE EXACT MEASUREMENTS YET</button></div></div>}<div className={styles.stepAction}><button type="button" disabled={!openings || !timeline || !measurementStatus} onClick={() => { track("project_details_completed"); advance(2); }}>CONTINUE <span>→</span></button></div></section>

      <section className={styles.step} id="project-step-4"><StepIntro number="04" label="UPLOAD" title="Upload your space." copy="Share photos, plans or inspiration. This step is optional." /><div className={styles.uploadLayout}><div className={`${styles.dropZone} ${dragging ? styles.dragging : ""}`} role="button" tabIndex={0} aria-label="Upload project files" onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fileInput.current?.click(); } }} onClick={() => fileInput.current?.click()} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { event.preventDefault(); if (event.currentTarget === event.target) setDragging(false); }} onDrop={(event: DragEvent<HTMLDivElement>) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}><input ref={fileInput} className={styles.srOnly} type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,application/pdf" onChange={(event: ChangeEvent<HTMLInputElement>) => { if (event.target.files) addFiles(event.target.files); event.target.value = ""; }} /><span aria-hidden="true">⇧</span><b>Drop files here</b><u>or browse files</u><small>Photos · Videos · Floor Plans · Inspiration Images<br />JPG, PNG, WEBP, MP4, MOV or PDF · 25 MB each · Up to 10 files</small></div>{uploads.length > 0 && <div className={styles.uploadGallery}>{uploads.map((item) => <article key={item.id} className={item.error ? styles.fileError : ""}>{item.url ? <Image src={item.url} alt="" fill unoptimized /> : <div><span>{item.kind === "video" ? "VIDEO" : "PDF"}</span><b>{item.file.name.split(".").pop()?.toUpperCase()}</b></div>}<button type="button" aria-label={`Remove ${item.file.name}`} onClick={() => { if (item.url) URL.revokeObjectURL(item.url); setUploads((current) => current.filter((file) => file.id !== item.id)); }}>×</button><footer><b>{item.file.name}</b><small>{item.error || `${(item.file.size / 1024 / 1024).toFixed(1)} MB · Ready`}</small><i><span style={{ width: `${item.error ? 0 : item.progress}%` }} /></i></footer></article>)}{uploads.length < 10 && <button type="button" className={styles.addMore} onClick={() => fileInput.current?.click()}>+<span>Add more</span></button>}</div>}</div><div className={styles.stepAction}><button type="button" onClick={() => advance(3)}>CONTINUE <span>→</span></button></div></section>

      <section className={styles.step} id="project-step-5"><StepIntro number="05" label="CONTACT" title="Almost there." copy="Let’s get your contact information." /><div className={styles.contactLayout}><div className={styles.contactFields}><FormField id="fullName" label="Full Name" value={contact.fullName} autoComplete="name" required onChange={(v) => updateContact("fullName", v)} /><FormField id="email" label="Email" value={contact.email} type="email" autoComplete="email" required onChange={(v) => updateContact("email", v)} /><FormField id="phone" label="Phone" value={contact.phone} type="tel" autoComplete="tel" required inputMode="tel" onChange={(v) => updateContact("phone", formatPhone(v))} /><FormField id="company" label="Company" value={contact.company} autoComplete="organization" onChange={(v) => updateContact("company", v)} /><FormField id="address" label="Project Address" value={contact.address} autoComplete="street-address" required wide onChange={(v) => updateContact("address", v)} /><FormField id="city" label="City" value={contact.city} autoComplete="address-level2" required onChange={(v) => updateContact("city", v)} /><FormField id="state" label="State" value={contact.state} autoComplete="address-level1" onChange={(v) => updateContact("state", v.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2))} /><FormField id="zip" label="ZIP Code" value={contact.zip} autoComplete="postal-code" inputMode="numeric" required onChange={(v) => updateContact("zip", v.replace(/[^0-9-]/g, "").slice(0, 10))} /><label className={styles.messageField}>Additional message<textarea value={contact.message} onChange={(event) => updateContact("message", event.target.value)} rows={3} /></label><fieldset className={styles.preferred}><legend>Preferred contact method</legend>{(["Phone", "Text", "Email"] as const).map((item) => <ChoiceRow key={item} active={contact.preferred === item} onClick={() => updateContact("preferred", item)}>{item}</ChoiceRow>)}</fieldset><label className={styles.honeypot} aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} /></label></div><ProjectSummary image={previewImage} projectType={projectType} solutions={solutions} openings={openings} timeline={timeline} measurementStatus={measurementStatus} location={[contact.city, contact.state, contact.zip].filter(Boolean).join(", ")} fileCount={uploads.filter((item) => !item.error).length} /></div><div className={styles.stepAction}>{error && currentStep === 4 && <p role="alert">{error}</p>}<button type="button" onClick={goToReview}>REVIEW PROJECT <span>→</span></button></div></section>

      <section className={styles.step} id="project-step-6"><StepIntro number="06" label="REVIEW & SUBMIT" title="Review and submit your project." copy="Our team will take it from here." /><div className={styles.reviewGrid}><div className={styles.reviewCard}><ReviewGroup title="Project" edit={() => scrollToStep(0)} lines={[projectType || "Not selected", solutions.join(" · ") || "No solutions selected"]} /><ReviewGroup title="Details" edit={() => scrollToStep(2)} lines={[`${openings || "—"} openings`, timeline || "Timeline not selected", measurementStatus || "Measurement status not selected"]} /><ReviewGroup title="Contact" edit={() => scrollToStep(4)} lines={[contact.fullName || "—", contact.email || "—", contact.phone || "—", [contact.address, contact.city, contact.state, contact.zip].filter(Boolean).join(", ") || "—"]} /><ReviewGroup title={`Files (${uploads.filter((item) => !item.error).length})`} edit={() => scrollToStep(3)} lines={uploads.filter((item) => !item.error).map((item) => item.file.name).length ? uploads.filter((item) => !item.error).map((item) => item.file.name) : ["No files added"]} /></div><div className={styles.submitPanel}><span>READY TO BRING YOUR PROJECT TO LIFE?</span><h3>Every detail begins with a thoughtful conversation.</h3><label className={styles.consent}><input id="privacy-consent" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><i aria-hidden="true">✓</i><span>I have read and accept the <a href="/privacy-policy" target="_blank">Privacy Policy</a>.</span></label><button type="submit" disabled={status === "submitting"}>{status === "submitting" ? "SECURELY SENDING YOUR PROJECT…" : "SUBMIT PROJECT"} <span>→</span></button>{error && <p role="alert">{error}</p>}<button className={styles.startOver} type="button" onClick={startOver}>START OVER</button></div></div></section>
    </form>
    {status === "submitting" && <div className={styles.submissionTransition} role="status" aria-live="polite"><div className={styles.secureLoader}><i /><span>SECURELY SENDING YOUR PROJECT</span></div></div>}
  </main>;
}

function LivePreview({ image, projectType, solutions }: { image: string; projectType: string; solutions: Solution[] }) {
  return <figure className={styles.livePreview}><div><Image src={image} alt="Live architectural project preview" fill sizes="(max-width: 760px) 100vw, 36vw" /><span className={solutions.includes("Smart Film") ? styles.filmLayer : ""} /><span className={solutions.includes("Motorized Roller Shades") ? styles.rollerLayer : ""} /><span className={solutions.includes("Custom Drapery") ? styles.draperyLayer : ""} /><span className={solutions.includes("Cellular Shades") ? styles.cellularLayer : ""} /></div><figcaption><b>LIVE PROJECT PREVIEW</b><span>{projectType || "Your space"} · Your selections shape the experience.</span></figcaption></figure>;
}

function ProjectSummary({ image, projectType, solutions, openings, timeline, measurementStatus, location, fileCount }: { image: string; projectType: string; solutions: Solution[]; openings: string; timeline: string; measurementStatus: string; location: string; fileCount: number }) {
  return <aside className={styles.summary}><div><span>YOUR PROJECT SUMMARY</span><dl><dt>Project Type</dt><dd>{projectType || "Pending"}</dd><dt>Solutions</dt><dd>{solutions.join(", ") || "Pending"}</dd><dt>Openings</dt><dd>{openings || "Pending"}</dd><dt>Timeline</dt><dd>{timeline || "Pending"}</dd><dt>Measurements</dt><dd>{measurementStatus || "Pending"}</dd><dt>Location</dt><dd>{location || "Pending"}</dd><dt>Uploaded Files</dt><dd>{fileCount}</dd></dl></div><figure><Image src={image} alt="Selected project atmosphere" fill sizes="(max-width: 760px) 100vw, 33vw" /><div /></figure></aside>;
}

function FormField({ id, label, value, onChange, type = "text", autoComplete, inputMode, required, wide }: { id: string; label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete?: string; inputMode?: "tel" | "numeric"; required?: boolean; wide?: boolean }) {
  return <label className={wide ? styles.fieldWide : styles.field}>{label}{required && <span> *</span>}<input id={id} type={type} value={value} required={required} autoComplete={autoComplete} inputMode={inputMode} aria-required={required} onChange={(event) => onChange(event.target.value)} /></label>;
}

function ReviewGroup({ title, lines, edit }: { title: string; lines: string[]; edit: () => void }) {
  return <section><header><h3>{title}</h3><button type="button" onClick={edit}>EDIT</button></header>{lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</section>;
}
