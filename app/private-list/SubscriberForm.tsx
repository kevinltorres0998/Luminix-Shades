"use client";

import { FormEvent, useState } from "react";
import styles from "./private-list.module.css";

export default function SubscriberForm() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle"); const [message, setMessage] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault(); setStatus("loading"); setMessage("");
    try { const response = await fetch("/api/subscribers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email }) }); const result = await response.json() as { message?: string; error?: string }; if (!response.ok) throw new Error(result.error || "Please try again."); setStatus("success"); setMessage(result.message || "You are on the list."); setName(""); setEmail(""); }
    catch (reason) { setStatus("error"); setMessage(reason instanceof Error ? reason.message : "Please try again."); }
  }
  return <form onSubmit={submit}><label>First name<input autoComplete="given-name" value={name} onChange={(event) => setName(event.target.value)} required /></label><label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label className={styles.consent}><input type="checkbox" required /><span>I agree to receive occasional news, offers and design inspiration from Luminix Shades.</span></label>{message && <p className={status === "success" ? styles.success : styles.error} role="status">{message}</p>}<button type="submit" disabled={status === "loading"}>{status === "loading" ? "JOINING…" : "JOIN THE PRIVATE LIST"}<i>→</i></button></form>;
}
