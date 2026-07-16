"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { conciergeCopy, conciergeSessionKey, projectDraftKey, projectRoute, whatsappNumber } from "./config";
import styles from "./AIConcierge.module.css";

type Message = { id: string; role: "user" | "assistant"; content: string; error?: boolean };
type StoredConversation = { messages: Message[] };

const welcomeMessage: Message = { id: "welcome", role: "assistant", content: conciergeCopy.welcome };
const unavailableMessage: Message = { id: "unavailable", role: "assistant", content: conciergeCopy.unavailable, error: true };

function track(event: string, detail: Record<string, string | number | boolean> = {}) {
  window.dispatchEvent(new CustomEvent("luminix:analytics", { detail: { event, ...detail } }));
  const dataLayer = (window as typeof window & { dataLayer?: Record<string, unknown>[] }).dataLayer;
  dataLayer?.push({ event, ...detail });
}

function loadMessages() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(conciergeSessionKey) || "null") as StoredConversation | null;
    return stored?.messages?.length ? stored.messages.slice(-20) : [welcomeMessage];
  } catch { return [welcomeMessage]; }
}

function projectContext(messages: Message[]) {
  const text = messages.filter((message) => message.role === "user").map((message) => message.content.toLowerCase()).join(" ");
  const projectType = /commercial|office|restaurant|retail|hotel|medical|conference/.test(text) ? "Commercial" : /residential|home|house|bedroom|living|nursery/.test(text) ? "Residential" : "";
  const solutions = [
    [/smart film|privacy glass|frosted glass/, "Smart Film"],
    [/motorized|roller shade|blackout|screen fabric/, "Motorized Roller Shades"],
    [/drapery|curtain|linen|velvet|sheer/, "Custom Drapery"],
    [/cellular|honeycomb/, "Cellular Shades"],
  ].filter(([pattern]) => (pattern as RegExp).test(text)).map(([, name]) => name as string);
  const goals = ["privacy", "blackout", "heat reduction", "automation", "light control", "design"].filter((goal) => text.includes(goal));
  return { projectType, solutions, summary: [solutions.length ? `Interests: ${solutions.join(", ")}.` : "", goals.length ? `Priorities: ${goals.join(", ")}.` : ""].filter(Boolean).join(" ") };
}

function prepareProjectDraft(messages: Message[]) {
  const context = projectContext(messages);
  try {
    const existing = JSON.parse(sessionStorage.getItem(projectDraftKey) || "null") || {};
    const contact = { fullName: "", email: "", phone: "", address: "", city: "", state: "FL", zip: "", company: "", preferred: "Email", ...(existing.contact || {}) };
    if (!contact.message && context.summary) contact.message = `AI Concierge summary: ${context.summary}`;
    sessionStorage.setItem(projectDraftKey, JSON.stringify({
      ...existing,
      projectType: existing.projectType || context.projectType,
      solutions: existing.solutions?.length ? existing.solutions : context.solutions,
      openings: existing.openings || "",
      timeline: existing.timeline || "",
      measurementStatus: existing.measurementStatus || "",
      measurements: existing.measurements?.length ? existing.measurements : [{ id: 1, width: "", height: "", unit: "in" }],
      skipMeasurements: Boolean(existing.skipMeasurements), contact, maxStep: existing.maxStep || 0,
    }));
  } catch { /* handoff still works without prefill */ }
}

function whatsappUrl(messages: Message[]) {
  const context = projectContext(messages);
  const summary = context.summary ? ` ${context.summary}` : "";
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Luminix Shades, I was speaking with the AI Concierge and would like help with my project.${summary}`)}`;
}

export default function AIConciergePanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const userCount = messages.filter((message) => message.role === "user").length;
  const showCta = useMemo(() => userCount >= 3 || messages.some((message) => message.role === "user" && /quote|estimate|consultation|appointment|schedule|book|start (my|a) project|speak|human|contact|cotiz|consulta|cita|proyecto/.test(message.content.toLowerCase())), [messages, userCount]);

  useEffect(() => {
    track("ai_chat_opened");
    const frame = requestAnimationFrame(() => { setMessages(loadMessages()); setHydrated(true); inputRef.current?.focus(); });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => { if (hydrated) try { sessionStorage.setItem(conciergeSessionKey, JSON.stringify({ messages: messages.slice(-20) })); } catch { /* optional */ } }, [messages, hydrated]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const sendMessage = async (question: string, quickAction = false) => {
    const clean = question.trim().slice(0, 1200);
    if (!clean || loading) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: clean };
    const next = [...messages.filter((message) => message.id !== "unavailable"), userMessage].slice(-18);
    setMessages(next); setInput(""); setLoading(true);
    track(quickAction ? "ai_chat_quick_action_selected" : "ai_chat_question_sent", { length: clean.length });
    const controller = new AbortController(); abortRef.current = controller;
    try {
      const response = await fetch("/api/ai-concierge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }), signal: controller.signal });
      const data = await response.json().catch(() => null) as { reply?: string } | null;
      if (!response.ok || !data?.reply?.trim()) throw new Error("concierge_unavailable");
      const assistantMessage: Message = { id: crypto.randomUUID(), role: "assistant", content: data.reply.trim() };
      setMessages((current) => [...current, assistantMessage].slice(-20));
    } catch (error) {
      if (controller.signal.aborted) return;
      setMessages((current) => [...current.filter((message) => message.id !== "unavailable"), unavailableMessage].slice(-20));
      track("ai_chat_error", { reason: error instanceof Error ? error.message.slice(0, 50) : "unknown" });
    } finally { if (!controller.signal.aborted) setLoading(false); }
  };

  const submit = (event: FormEvent) => { event.preventDefault(); void sendMessage(input); };
  const handleInputKey = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); if (input.trim()) void sendMessage(input); } };
  const startNew = () => { abortRef.current?.abort(); setLoading(false); setMessages([welcomeMessage]); setInput(""); try { sessionStorage.removeItem(conciergeSessionKey); } catch { /* optional */ } inputRef.current?.focus(); };

  return (
    <section ref={panelRef} id="luminix-ai-concierge-dialog" className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="ai-concierge-title">
      <header className={styles.header}>
        <span className={styles.headerMark} aria-hidden="true"><i /></span>
        <div><h2 id="ai-concierge-title">{conciergeCopy.name}</h2><p>{conciergeCopy.subtitle}</p></div>
        <button type="button" className={styles.newConversation} onClick={startNew}>NEW</button>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close Luminix AI Concierge">×</button>
      </header>

      <div ref={scrollRef} className={styles.conversation} aria-live="polite" aria-busy={loading}>
        {messages.map((message) => <article key={message.id} className={`${styles.message} ${message.role === "user" ? styles.userMessage : styles.assistantMessage} ${message.error ? styles.errorMessage : ""}`}><span>{message.role === "assistant" ? "LUMINIX" : "YOU"}</span>{message.content.split("\n").map((line, index) => line ? <p key={`${message.id}-${index}`}>{line}</p> : <br key={`${message.id}-${index}`} />)}</article>)}
        {userCount === 0 && <div className={styles.quickActions}>{conciergeCopy.quickActions.map((action) => <button type="button" key={action} onClick={() => void sendMessage(action, true)}>{action}<span>→</span></button>)}</div>}
        {loading && <div className={styles.thinking} role="status"><span /><span /><span /><b>Considering your space</b></div>}
        {showCta && <aside className={styles.ctaCard}><span>YOUR NEXT STEP</span><h3>Your next step</h3><p>Based on what you described, a consultation with our design team would be the best way to review your space and recommend the right solution.</p><Link href={projectRoute} onClick={() => { prepareProjectDraft(messages); track("ai_chat_form_cta_clicked"); }}>START YOUR PROJECT</Link><a href={whatsappUrl(messages)} target="_blank" rel="noopener noreferrer" onClick={() => track("ai_chat_whatsapp_clicked")}>CONTINUE ON WHATSAPP</a></aside>}
        {messages.some((message) => message.error) && !showCta && <aside className={styles.errorActions}><Link href={projectRoute} onClick={() => { prepareProjectDraft(messages); track("ai_chat_form_cta_clicked"); }}>START YOUR PROJECT</Link><a href={whatsappUrl(messages)} target="_blank" rel="noopener noreferrer" onClick={() => track("ai_chat_whatsapp_clicked")}>CONTINUE ON WHATSAPP</a></aside>}
      </div>

      <form className={styles.composer} onSubmit={submit}>
        <label htmlFor="ai-concierge-input" className={styles.srOnly}>Ask Luminix AI Concierge about your project</label>
        <textarea ref={inputRef} id="ai-concierge-input" value={input} maxLength={1200} rows={1} placeholder={conciergeCopy.placeholder} onChange={(event) => setInput(event.target.value)} onKeyDown={handleInputKey} disabled={loading} />
        <button type="submit" disabled={loading || !input.trim()} aria-label="Send message"><span aria-hidden="true">↗</span></button>
        <small>ENTER TO SEND · SHIFT + ENTER FOR A NEW LINE</small>
      </form>
    </section>
  );
}
