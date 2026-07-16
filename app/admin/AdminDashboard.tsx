"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChatGPTUser } from "../chatgpt-auth";
import { leadStages, type AdminProjectLead, type LeadStage } from "../lib/admin-leads";
import styles from "./admin.module.css";

const projectImages: Record<string, string> = { Residential: "/images/residential.png", Commercial: "/images/commercial-hero-boardroom.png", Hospitality: "/images/about-hospitality.png", "New Construction": "/images/residential-architectural-composition.png", Yacht: "/images/drapery-final-sunset.png" };
const stageClass: Record<LeadStage, string> = { "New Lead": styles.newLead, Consultation: styles.consultation, Measurement: styles.measurement, "Proposal Sent": styles.proposal, Installation: styles.installation, Completed: styles.completed };
type AdminView = "Dashboard" | "Leads" | "Pipeline" | "Calendar" | "Projects" | "Proposals" | "Installations" | "Clients" | "Analytics" | "Users" | "Settings";
const mainNavigation: { view: AdminView; icon: string }[] = [{ view: "Dashboard", icon: "⌂" }, { view: "Leads", icon: "◇" }, { view: "Pipeline", icon: "◫" }, { view: "Calendar", icon: "□" }, { view: "Projects", icon: "▱" }, { view: "Proposals", icon: "▤" }, { view: "Installations", icon: "⌁" }, { view: "Clients", icon: "♙" }, { view: "Analytics", icon: "▥" }];
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
  const [activeView, setActiveView] = useState<AdminView>("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const selected = leads.find((lead) => lead.submissionId === selectedId) || null;
  const filtered = useMemo(() => leads.filter((lead) => {
    const haystack = `${lead.contact.fullName} ${lead.contact.email} ${lead.contact.phone} ${lead.contact.city} ${lead.projectType} ${lead.solutions.join(" ")}`.toLowerCase();
    const viewStage = activeView === "Proposals" ? "Proposal Sent" : activeView === "Installations" ? "Installation" : null;
    return (!query || haystack.includes(query.toLowerCase())) && (filter === "All" || stageOf(lead) === filter) && (!viewStage || stageOf(lead) === viewStage);
  }), [leads, query, filter, activeView]);
  const counts = useMemo(() => Object.fromEntries(leadStages.map((stage) => [stage, leads.filter((lead) => stageOf(lead) === stage).length])) as Record<LeadStage, number>, [leads]);
  const thisWeek = leads.filter((lead) => Date.parse(generatedAt) - Date.parse(lead.receivedAt) < 7 * 86400000).length;

  function openView(view: AdminView) {
    setActiveView(view); setQuery(""); setFilter("All"); setMobileMenu(false);
    document.querySelector(`.${styles.workspace}`)?.scrollTo({ top: 0, behavior: "smooth" });
  }

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
    <aside className={`${styles.sidebar} ${mobileMenu ? styles.sidebarOpen : ""}`}>
      <Link className={styles.brand} href="/" aria-label="Luminix Shades home"><Image src="/images/logo-white.png" alt="Luminix Shades" width={154} height={44} unoptimized /></Link>
      <nav aria-label="Administrator navigation"><small>MAIN</small>{mainNavigation.map((item) => <button className={activeView === item.view ? styles.active : ""} type="button" key={item.view} onClick={() => openView(item.view)}><i>{item.icon}</i>{item.view}{item.view === "Leads" && <b>{leads.length}</b>}</button>)}<small>SYSTEM</small><button className={activeView === "Users" ? styles.active : ""} type="button" onClick={() => openView("Users")}><i>♙</i>Users</button><button className={activeView === "Settings" ? styles.active : ""} type="button" onClick={() => openView("Settings")}><i>⚙</i>Settings</button></nav>
      <div className={styles.account}><b>{user.displayName}</b><span>Administrator</span></div><a className={styles.logout} href="/signout-with-chatgpt?return_to=/admin">↪ Log out</a>
    </aside>

    <section className={styles.workspace}>
      <header className={styles.topbar}><button className={styles.menu} type="button" aria-label="Open navigation" aria-expanded={mobileMenu} onClick={() => setMobileMenu((value) => !value)}>☰</button><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads, projects, clients…" /></label><div><span className={styles.bell}>♧</span><b>{user.displayName}</b><small>Administrator</small></div></header>
      <div className={styles.content}>
        <div className={styles.welcome}><div><h1>{activeView === "Dashboard" ? `Good morning, ${user.fullName?.split(" ")[0] || "Kevin"}.` : activeView}</h1><p>{activeView === "Dashboard" ? "Here’s what’s happening with your projects today." : `Manage your ${activeView.toLowerCase()} from one place.`}</p></div><time>{formatDate(generatedAt)}</time></div>
        {storageError && <p className={styles.alert}>{storageError}</p>}
        {activeView !== "Dashboard" && <ViewPanel view={activeView} leads={leads} counts={counts} user={user} onOpenLead={(id) => { setSelectedId(id); }} />}
        <section className={styles.metrics} aria-label="Lead overview">
          <Metric icon="♙" label="New Leads" value={counts["New Lead"]} note={`${thisWeek} received this week`} />
          <Metric icon="□" label="Consultations" value={counts.Consultation} note="Active opportunities" />
          <Metric icon="▥" label="Measurements" value={counts.Measurement} note="Awaiting or scheduled" />
          <Metric icon="▱" label="Proposals Sent" value={counts["Proposal Sent"]} note="Follow-up required" />
          <Metric icon="⌁" label="Installations" value={counts.Installation} note="In progress" />
          <Metric dark icon="◇" label="Active Pipeline" value={leads.filter((lead) => stageOf(lead) !== "Completed").length} note={`${counts.Completed} completed`} />
        </section>

        <section className={styles.leadsCard} id="leads"><header><div><h2>{activeView === "Proposals" ? "Proposals Sent" : activeView === "Installations" ? "Active Installations" : activeView === "Clients" ? "Client Directory" : "Recent Leads"}</h2><p>{filtered.length} project request{filtered.length === 1 ? "" : "s"}</p></div><select value={filter} onChange={(event) => setFilter(event.target.value as LeadStage | "All")}><option>All</option>{leadStages.map((stage) => <option key={stage}>{stage}</option>)}</select></header>
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

function ViewPanel({ view, leads, counts, user, onOpenLead }: { view: AdminView; leads: AdminProjectLead[]; counts: Record<LeadStage, number>; user: ChatGPTUser; onOpenLead: (id: string) => void }) {
  const active = leads.filter((lead) => stageOf(lead) !== "Completed");
  if (view === "Pipeline") return <section className={styles.viewPanel}><header><span>SALES PIPELINE</span><h2>{active.length} active opportunities</h2></header><div className={styles.stageBoard}>{leadStages.map((stage) => <article key={stage}><b>{stage}</b><strong>{counts[stage]}</strong><small>{leads.filter((lead) => stageOf(lead) === stage).slice(0, 3).map((lead) => <button type="button" key={lead.submissionId} onClick={() => onOpenLead(lead.submissionId)}>{lead.contact.fullName}<i>{lead.projectType}</i></button>)}</small></article>)}</div></section>;
  if (view === "Calendar") return <section className={styles.viewPanel}><header><span>ACTIVITY CALENDAR</span><h2>Recent project activity</h2></header><div className={styles.activityList}>{leads.slice(0, 8).map((lead) => <button type="button" key={lead.submissionId} onClick={() => onOpenLead(lead.submissionId)}><time>{new Date(lead.receivedAt).getDate()}<small>{new Date(lead.receivedAt).toLocaleString("en-US", { month: "short" })}</small></time><span><b>{lead.contact.fullName}</b><small>{lead.projectType} request · {lead.contact.city}</small></span><em>{stageOf(lead)}</em></button>)}</div></section>;
  if (view === "Analytics") return <section className={styles.viewPanel}><header><span>PERFORMANCE</span><h2>Lead analytics</h2></header><div className={styles.insightGrid}><article><strong>{leads.length}</strong><span>Total requests</span></article><article><strong>{leads.filter((lead) => lead.projectType === "Residential").length}</strong><span>Residential</span></article><article><strong>{leads.filter((lead) => lead.projectType === "Commercial").length}</strong><span>Commercial</span></article><article><strong>{counts.Completed}</strong><span>Completed</span></article></div></section>;
  if (view === "Users") return <section className={styles.viewPanel}><header><span>TEAM ACCESS</span><h2>Administrator users</h2></header><div className={styles.userCard}><i>{user.displayName.split(" ").map((word) => word[0]).join("").slice(0, 2)}</i><div><b>{user.displayName}</b><span>{user.email}</span><small>Owner · Administrator</small></div><em>ACTIVE</em></div></section>;
  if (view === "Settings") return <section className={styles.viewPanel}><header><span>WORKSPACE</span><h2>Administration settings</h2></header><div className={styles.settingsGrid}><article><b>Lead notifications</b><span>info@luminixshades.com</span><small>Internal project requests</small></article><article><b>Scheduling</b><span>Acuity Scheduling</span><small>Consultation booking flow</small></article><article><b>File security</b><span>Private storage</span><small>Signed, expiring links</small></article><article><b>Administrator access</b><span>Private sign-in</span><small>Email allowlist enabled</small></article></div></section>;
  const title = view === "Proposals" ? "Proposal follow-up" : view === "Installations" ? "Installation management" : view === "Clients" ? "Client relationships" : view === "Projects" ? "All projects" : "Lead management";
  return <section className={styles.viewPanel}><header><span>{view.toUpperCase()}</span><h2>{title}</h2></header><div className={styles.insightGrid}><article><strong>{view === "Proposals" ? counts["Proposal Sent"] : view === "Installations" ? counts.Installation : leads.length}</strong><span>{view}</span></article><article><strong>{active.length}</strong><span>Active</span></article><article><strong>{counts["New Lead"]}</strong><span>New leads</span></article><article><strong>{counts.Completed}</strong><span>Completed</span></article></div></section>;
}

function Metric({ icon, label, value, note, dark = false }: { icon: string; label: string; value: number; note: string; dark?: boolean }) { return <article className={dark ? styles.metricDark : ""}><header><i>{icon}</i><b>{label}</b></header><strong>{value}</strong><small>{note}</small></article>; }
