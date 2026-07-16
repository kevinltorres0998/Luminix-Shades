"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "./auth.module.css";

export default function AuthForm({ mode, token = "", invitedEmail = "" }: { mode: "login" | "register"; token?: string; invitedEmail?: string }) {
  const [email, setEmail] = useState(invitedEmail);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch(`/api/admin/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, fullName, password, token }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to continue.");
      window.location.assign("/admin");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to continue."); setLoading(false); }
  }

  return <main className={styles.page}>
    <section className={styles.card} aria-labelledby="admin-auth-title">
      <Link className={styles.logo} href="/" aria-label="Luminix Shades home"><Image src="/images/logo-white.png" alt="Luminix Shades" width={2420} height={689} priority unoptimized /></Link>
      <div className={styles.heading}><span>ADMINISTRATION</span><h1 id="admin-auth-title">{mode === "login" ? "Sign in" : "Create account"}</h1>{mode === "register" && <p>Accept your private administrator invitation.</p>}</div>
      <form onSubmit={submit}>
        {mode === "register" && <label>Full name<input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label>}
        <label>Email<input type="email" autoComplete="email" value={email} readOnly={Boolean(invitedEmail)} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Password<div className={styles.password}><input type={show ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === "register" ? 10 : 1} /><button type="button" onClick={() => setShow((value) => !value)}>{show ? "Hide" : "Show"}</button></div></label>
        {mode === "register" && <small>10+ characters with uppercase, lowercase and a number.</small>}
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <button className={styles.submit} type="submit" disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
      </form>
      {mode === "register" && <footer>Already registered? <Link href="/admin/login">Sign in</Link></footer>}
      <small className={styles.security}>SECURE PRIVATE WORKSPACE</small>
    </section>
  </main>;
}
