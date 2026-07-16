"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChatGPTUser } from "../chatgpt-auth";
import { leadStages, type AdminProjectLead, type LeadStage } from "../lib/admin-leads";
import styles from "./admin.module.css";

const projectImages: Record<string, string> = { Residential: "/images/residential.png", Commercial: "/images/commercial-hero-boardroom.png", Hospitality: "/images/about-hospitality.png", "New Construction": "/images/residential-architectural-composition.png", Yacht: "/images/drapery-final-sunset.png" };
const stageClass: Record<LeadStage, string> = { "New Lead": styles.newLead, Consultation: styles.consultation, Measurement: styles.measurement, "Proposal Sent": styles.proposal, Installation: styles.installation, Completed: styles.completed };
const formatDate = (value: string, full = false) => new Intl.DateTimeFormat("en-US", full ? { dateStyle: "medium", timeStyle: "short" } : { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
const stageOf = (lead: AdminProjectLead): LeadStage => lead.admin?.stage || "New Lead";

export default function AdminDashboard({ initialLeads, user, storageError, generatedAt }: { initialLeads: AdminProjectLead[]; user: ChatGPTUser; storageError: string; generatedAt: string }) {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedId, setSelectedId] = useState(initialLeads[0]?.submissionId || "");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LeadStage | "All">("All");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const selected = leads.find((lead) => lead.submissionId === selectedId) || null;
  const filtered = useMemo(() => leads.filter((lead) => {
    const haystack = `${lead.contact.fullName} ${lead.contact.email} ${lead.contact.phone} ${lead.contact.city} ${lead.projectType} ${lead.solutions.join(" ")}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (filter === "All" || stageOf(lead) === filter);
  }), [leads, query, filter]);
  const counts = useMemo(() => Object.fromEntries(leadStages.map((stage) => [stage, leads.filter((lead) => stageOf(lead) === stage).length])) as Record<LeadStage, number>, [leads]);
  const thisWeek = leads.filter((lead) => Date.parse(generatedAt) - Date.parse(lead.receivedAt) < 7 * 86400000).length;

  async function updateLead(update: { stage?: LeadStage; note?: string }) {
    if (!selected || saving) return;
    setSaving(true); setNotice("");
    try {
      const response = await fetch("/api/admin/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submissionId: selected.submissionId, ...update }) });
      const result = await response.json() as { ok?: boolean; lead?: AdminProjectLead; error?: string };
      if (!response.ok || !result.lead) throw new Error(result.error || "Update failed.");
      setLeads((current) => current.map((lead) => lead.submissionId === result.lead?.submissionId ? result.lead : lead));
      if (update.note) setNote("");
      setNotice("Saved");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Update failed."); }
    finally { setSaving(false); }
  }

  return <main className={styles.shell}>
    <aside className={styles.sidebar}>
      <Link className={styles.brand} href="/" aria-label="Luminix Shades home"><Image src="/images/logo-white.png" alt="Luminix Shades" width={154} height={44} unoptimized /></Link>
      <nav aria-label="Administrator navigation"><small>MAIN</small><a className={styles.active} href="/admin"><i>⌂</i>Dashboard</a><button type="button" onClick={() => { setFilter("All"); document.getElementById("leads")?.scrollIntoView({ behavior: "smooth" }); }}><i>◇</i>Leads <b>{leads.length}</b></button><button type="button" onClick={() => document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" })}><i>◫</i>Pipeline</button><span><i>□</i>Calendar</span><span><i>▱</i>Projects</span><span><i>▤</i>Proposals</span><span><i>⌁</i>Installations</span><span><i>♙</i>Clients</span><span><i>▥</i>Analytics</span><small>SYSTEM</small><span><i>♙</i>Users</span><span><i>⚙</i>Settings</span></nav>
      <div className={styles.account}><b>{user.displayName}</b><span>Administrator</span></div><a className={styles.logout} href="/signout-with-chatgpt?return_to=/admin">↪ Log out</a>
    </aside>

    <section className={styles.workspace}>
      <header className={styles.topbar}><button className={styles.menu} type="button" aria-label="Open navigation">☰</button><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads, projects, clients…" /></label><div><span className={styles.bell}>♧</span><b>{user.displayName}</b><small>Administrator</small></div></header>
      <div className={styles.content}>
        <div className={styles.welcome}><div><h1>Good morning, {user.fullName?.split(" ")[0] || "Kevin"}.</h1><p>Here&apos;s what&apos;s happening with your projects today.</p></div><time>{formatDate(new Date().toISOString())}</time></div>
        {storageError && <p className={styles.alert}>{storageError}</p>}
        <section className={styles.metrics} aria-label="Lead overview">
          <Metric icon="♙" label="New Leads" value={counts["New Lead"]} note={`${thisWeek} received this week`} />
          <Metric icon="□" label="Consultations" value={counts.Consultation} note="Active opportunities" />
          <Metric icon="▥" label="Measurements" value={counts.Measurement} note="Awaiting or scheduled" />
          <Metric icon="▱" label="Proposals Sent" value={counts["Proposal Sent"]} note="Follow-up required" />
          <Metric icon="⌁" label="Installations" value={counts.Installation} note="In progress" />
          <Metric dark icon="◇" label="Active Pipeline" value={leads.filter((lead) => stageOf(lead) !== "Completed").length} note={`${counts.Completed} completed`} />
        </section>

        <section className={styles.leadsCard} id="leads"><header><div><h2>Recent Leads</h2><p>{filtered.length} project request{filtered.length === 1 ? "" : "s"}</p></div><select value={filter} onChange={(event) => setFilter(event.target.value as LeadStage | "All")}><option>All</option>{leadStages.map((stage) => <option key={stage}>{stage}</option>)}</select></header>
          <div className={styles.table}><div className={styles.tableHead}><span>LEAD</span><span>PROJECT TYPE</span><span>LOCATION</span><span>SUBMITTED</span><span>STATUS</span><span>FILES</span></div>{filtered.length ? filtered.map((lead) => <button type="button" key={lead.submissionId} className={`${styles.leadRow} ${selectedId === lead.submissionId ? styles.selectedRow : ""}`} onClick={() => setSelectedId(lead.submissionId)}><span className={styles.leadIdentity}><Image src={projectImages[lead.projectType] || "/images/hero.png"} alt="" width={62} height={48} /><i><b>{lead.contact.fullName}</b><small>{lead.contact.email}</small><small>{lead.contact.phone}</small></i></span><span>{lead.projectType}</span><span>{lead.contact.city}, {lead.contact.state}</span><span>{formatDate(lead.receivedAt)}<small>{new Date(lead.receivedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</small></span><span><em className={stageClass[stageOf(lead)]}>{stageOf(lead)}</em></span><span>{lead.files.length}</span></button>) : <div className={styles.empty}><b>No leads found.</b><span>New project requests will appear here automatically.</span></div>}</div>
        </section>

        <section className={styles.overview} id="pipeline"><article><span>LEADS OVERVIEW</span><strong>{leads.length}</strong><p>Total leads</p><div className={styles.spark}>{[18,28,43,35,51,62,78].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></article><article><span>LEADS BY PROJECT TYPE</span><div className={styles.donut} style={{ "--residential": `${leads.length ? Math.round(leads.filter((lead) => lead.projectType === "Residential").length / leads.length * 100) : 0}%` } as React.CSSProperties}><b>{leads.length}</b><small>Total</small></div><ul>{["Residential", "Commercial", "Hospitality", "New Construction", "Yacht"].map((type) => <li key={type}><i />{type}<b>{leads.filter((lead) => lead.projectType === type).length}</b></li>)}</ul></article><article><span>PIPELINE BY STAGE</span>{leadStages.map((stage) => <div className={styles.pipelineRow} key={stage}><small>{stage}</small><i><b style={{ width: `${leads.length ? Math.max(4, counts[stage] / leads.length * 100) : 0}%` }} /></i><strong>{counts[stage]}</strong></div>)}</article></section>
      </div>
    </section>

    {selected && <aside className={styles.detail}>
      <header><button type="button" onClick={() => setSelectedId("")} aria-label="Close lead details">×</button><Image src={projectImages[selected.projectType] || "/images/hero.png"} alt={`${selected.projectType} project`} width={440} height={210} /><em className={stageClass[stageOf(selected)]}>{stageOf(selected)}</em></header>
      <div className={styles.detailBody}><div className={styles.person}><h2>{selected.contact.fullName}</h2><p>{selected.projectType} Project&nbsp; • &nbsp;{selected.contact.city}, {selected.contact.state}</p><small>Submitted {formatDate(selected.receivedAt, true)}</small><div><a href={`tel:${selected.contact.phone}`}>☎</a><a href={`mailto:${selected.contact.email}`}>✉</a></div></div>
        <nav><b>Overview</b><span>Files ({selected.files.length})</span><span>Notes ({selected.admin?.notes?.length || 0})</span></nav>
        <section><header><h3>Project Information</h3><select value={stageOf(selected)} disabled={saving} onChange={(event) => updateLead({ stage: event.target.value as LeadStage })}>{leadStages.map((stage) => <option key={stage}>{stage}</option>)}</select></header><div className={styles.infoGrid}><dl><dt>Project Type</dt><dd>{selected.projectType}</dd><dt>Products</dt><dd>{selected.solutions.join(", ")}</dd><dt>Number of Openings</dt><dd>{selected.details.openings}</dd><dt>Timeline</dt><dd>{selected.details.timeline}</dd><dt>Measurements</dt><dd>{selected.details.measurementStatus}</dd></dl><dl><dt>Project Address</dt><dd>{selected.contact.address}<br />{selected.contact.city}, {selected.contact.state} {selected.contact.zip}</dd><dt>Contact Information</dt><dd>{selected.contact.email}<br />{selected.contact.phone}</dd><dt>Preferred Contact</dt><dd>{selected.contact.preferred}</dd><dt>Company</dt><dd>{selected.contact.company || "—"}</dd></dl></div>{selected.contact.message && <div className={styles.message}><b>Additional Message</b><p>{selected.contact.message}</p></div>}</section>
        {selected.files.length > 0 && <section><h3>Uploaded Files</h3><div className={styles.files}>{selected.files.map((file) => <a key={file.pathname} href={file.secureUrl} target="_blank" rel="noreferrer"><span>↗</span><b>{file.name}</b><small>{(file.size / 1024 / 1024).toFixed(1)} MB</small></a>)}</div></section>}
        <section><h3>Internal Notes</h3><form onSubmit={(event) => { event.preventDefault(); if (note.trim()) updateLead({ note: note.trim() }); }}><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a private note about this lead…" maxLength={2000} /><button disabled={saving || !note.trim()}>{saving ? "SAVING…" : "ADD NOTE"}</button><small>{notice}</small></form>{selected.admin?.notes?.map((item) => <article className={styles.note} key={item.id}><p>{item.text}</p><small>{item.author} · {formatDate(item.createdAt, true)}</small></article>)}</section>
      </div>
    </aside>}
  </main>;
}

function Metric({ icon, label, value, note, dark = false }: { icon: string; label: string; value: number; note: string; dark?: boolean }) { return <article className={dark ? styles.metricDark : ""}><header><i>{icon}</i><b>{label}</b></header><strong>{value}</strong><small>{note}</small></article>; }
