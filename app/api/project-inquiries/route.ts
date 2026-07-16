import { get, head, put } from "@vercel/blob";
import { Resend } from "resend";
import { customerEmail, internalEmail, type ProjectLead, type StoredFile } from "./email";

export const runtime = "nodejs";
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const allowedProjectTypes = new Set(["Residential", "Commercial", "Hospitality", "New Construction", "Yacht"]);
const allowedSolutions = new Set(["Smart Film", "Motorized Roller Shades", "Custom Drapery", "Cellular Shades"]);
const allowedTimelines = new Set(["Immediately", "Within 30 days", "Planning stage", "Not sure yet"]);
const allowedOpenings = new Set(["1-5", "6-10", "11-20", "20+"]);
const allowedContact = new Set(["Phone", "Text", "Email"]);
const allowedFileTypes = new Set(["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime", "application/pdf"]);
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const clean = (value: unknown, max = 500) => typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";
const clientId = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";
const jsonError = (code: string, message: string, status: number) => Response.json({ ok: false, error: { code, message } }, { status });

async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  const blob = await get(pathname, { access: "private", useCache: false }).catch(() => null);
  if (!blob) return null;
  return new Response(blob.stream).json().catch(() => null) as Promise<T | null>;
}

async function enforceRateLimit(request: Request, now: number) {
  const secret = process.env.FILE_LINK_SECRET;
  if (!secret) throw new Error("FILE_LINK_SECRET is not configured");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${secret}:${clientId(request)}`));
  const key = Buffer.from(digest).toString("hex");
  const pathname = `project-inquiries/_rate-limits/${key}.json`;
  const existing = await readJsonBlob<{ attempts?: number[] }>(pathname);
  const attempts = (existing?.attempts || []).filter((time) => Number.isFinite(time) && now - time < WINDOW_MS);
  if (attempts.length >= LIMIT) return false;
  attempts.push(now);
  await put(pathname, JSON.stringify({ attempts }), { access: "private", contentType: "application/json", allowOverwrite: true });
  return true;
}

async function signedFileUrl(origin: string, pathname: string, submissionId: string) {
  const secret = process.env.FILE_LINK_SECRET;
  if (!secret) throw new Error("FILE_LINK_SECRET is not configured");
  const expires = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const data = `${submissionId}:${pathname}:${expires}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = Buffer.from(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))).toString("base64url");
  return `${origin}/api/project-inquiries/files?id=${encodeURIComponent(submissionId)}&path=${encodeURIComponent(pathname)}&expires=${expires}&signature=${signature}`;
}

export async function POST(request: Request) {
  const now = Date.now();
  if (!process.env.BLOB_READ_WRITE_TOKEN) return jsonError("storage_unavailable", "Secure project storage is temporarily unavailable.", 503);
  if (!process.env.FILE_LINK_SECRET) return jsonError("configuration_unavailable", "Secure submission protection is temporarily unavailable.", 503);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return jsonError("invalid_json", "The request could not be read.", 400);
  if (clean(body.website, 100)) return jsonError("invalid_submission", "The project request could not be accepted.", 422);

  const submissionId = clean(body.submissionId, 64);
  if (!/^[0-9a-f-]{36}$/i.test(submissionId)) return jsonError("invalid_submission_id", "The submission identifier is invalid.", 400);
  const recordPath = `project-inquiries/${submissionId}/submission.json`;
  const existing = await readJsonBlob<ProjectLead>(recordPath);
  if (existing) return Response.json({ ok: true, status: "duplicate", submissionId }, { status: 200 });
  const projectType = clean(body.projectType, 50);
  const solutions = Array.isArray(body.solutions) ? body.solutions.map((v) => clean(v, 60)).filter((v) => allowedSolutions.has(v)).slice(0, 4) : [];
  const rawDetails = body.details && typeof body.details === "object" ? body.details as Record<string, unknown> : {};
  const rawContact = body.contact && typeof body.contact === "object" ? body.contact as Record<string, unknown> : {};
  const email = clean(rawContact.email, 254).toLowerCase();
  const phone = clean(rawContact.phone, 30);
  const openings = clean(rawDetails.openings, 20);
  const openingsKey = openings.replace(/[^0-9+]+/g, "-");
  const timeline = clean(rawDetails.timeline, 40);
  const measurementStatus = clean(rawDetails.measurementStatus, 40);
  if (!allowedProjectTypes.has(projectType) || !solutions.length || !allowedOpenings.has(openingsKey) || !allowedTimelines.has(timeline) || !["I have measurements", "I need measurements"].includes(measurementStatus)) return jsonError("invalid_project", "Please review the project selections.", 422);
  if (!clean(rawContact.fullName, 120) || !/^\S+@\S+\.\S+$/.test(email) || phone.replace(/\D/g, "").length < 10 || !clean(rawContact.address, 180) || !clean(rawContact.city, 80) || !/^\d{5}(?:-\d{4})?$/.test(clean(rawContact.zip, 10))) return jsonError("invalid_contact", "Please review the required contact fields.", 422);

  const rawFiles = Array.isArray(body.files) ? body.files.slice(0, 10) : [];
  const files: StoredFile[] = [];
  for (const value of rawFiles) {
    if (!value || typeof value !== "object") continue;
    const file = value as Record<string, unknown>;
    const pathname = clean(file.pathname, 500);
    if (!pathname.startsWith(`project-inquiries/${submissionId}/`)) return jsonError("invalid_file", "An uploaded file reference is invalid.", 422);
    const metadata = await head(pathname).catch(() => null);
    if (!metadata) return jsonError("missing_file", "An uploaded file could not be verified.", 422);
    if (!allowedFileTypes.has(clean(metadata.contentType, 100)) || metadata.size > MAX_FILE_SIZE) return jsonError("invalid_file", "An uploaded file type or size is not supported.", 422);
    files.push({ name: clean(file.name, 180), pathname, contentType: clean(metadata.contentType, 100), size: metadata.size, secureUrl: await signedFileUrl(new URL(request.url).origin, pathname, submissionId) });
  }

  const measurements = Array.isArray(rawDetails.measurements) ? rawDetails.measurements.slice(0, 50).map((value) => { const m = value && typeof value === "object" ? value as Record<string, unknown> : {}; return { width: clean(m.width, 12), height: clean(m.height, 12), unit: ["in", "cm"].includes(clean(m.unit, 2)) ? clean(m.unit, 2) : "in" }; }) : [];
  const utmSource = body.utm && typeof body.utm === "object" ? body.utm as Record<string, unknown> : {};
  const utm = Object.fromEntries(Object.entries(utmSource).slice(0, 10).map(([key, value]) => [clean(key, 50), clean(value, 150)]).filter(([key]) => key.startsWith("utm_")));
  try {
    if (!await enforceRateLimit(request, now)) return jsonError("rate_limited", "Please wait before sending another project request.", 429);
  } catch (error) {
    console.error("project_submission_rate_limit_failed", { submissionId, error: error instanceof Error ? error.name : "unknown" });
    return jsonError("protection_unavailable", "Secure submission protection is temporarily unavailable. Please try again.", 503);
  }
  const lead: ProjectLead = {
    submissionId, receivedAt: new Date().toISOString(), source: clean(body.source, 120) || "/plan-your-project", referrer: clean(body.referrer, 500), utm,
    projectType, solutions,
    details: { openings, timeline, measurementStatus, exactMeasurementsPending: Boolean(rawDetails.exactMeasurementsPending), measurements },
    contact: { fullName: clean(rawContact.fullName, 120), email, phone, company: clean(rawContact.company, 120), address: clean(rawContact.address, 180), city: clean(rawContact.city, 80), state: clean(rawContact.state, 40), zip: clean(rawContact.zip, 10), message: clean(rawContact.message, 4000), preferred: allowedContact.has(clean(rawContact.preferred, 10)) ? clean(rawContact.preferred, 10) : "Email" },
    files, deliveryStatus: "stored",
  };

  try {
    await put(recordPath, JSON.stringify(lead, null, 2), { access: "private", contentType: "application/json", addRandomSuffix: false });
  } catch (error) {
    const existing = await get(recordPath, { access: "private", useCache: false }).catch(() => null);
    if (existing) return Response.json({ ok: true, status: "duplicate", submissionId }, { status: 200 });
    console.error("project_submission_storage_failed", { submissionId, error: error instanceof Error ? error.name : "unknown" });
    return jsonError("storage_failed", "Your project could not be stored. Your information remains in the form; please try again.", 503);
  }

  if (!process.env.RESEND_API_KEY) return Response.json({ ok: true, status: "stored_email_pending", submissionId, message: "Your project was stored securely. Email delivery is pending." }, { status: 202 });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.PROJECT_EMAIL_FROM || "Luminix Shades <notifications@luminixshades.com>";
  const internal = internalEmail(lead);
  const customer = customerEmail(lead);
  try {
    const [internalResult, customerResult] = await Promise.all([
      resend.emails.send({ from, to: [process.env.PROJECT_INQUIRY_TO_EMAIL || "info@luminixshades.com"], subject: `New Project Request — ${lead.projectType} — ${lead.contact.city}`, html: internal.html, text: internal.text, replyTo: lead.contact.email }),
      resend.emails.send({ from, to: [lead.contact.email], subject: "We received your Luminix Shades project", html: customer.html, text: customer.text, replyTo: process.env.PROJECT_INQUIRY_TO_EMAIL || "info@luminixshades.com" }),
    ]);
    if (internalResult.error || customerResult.error) throw new Error("Resend rejected one or more messages");
    lead.deliveryStatus = "delivered";
    await put(recordPath, JSON.stringify({ ...lead, emailIds: { internal: internalResult.data?.id, customer: customerResult.data?.id } }, null, 2), { access: "private", contentType: "application/json", allowOverwrite: true });
    return Response.json({ ok: true, status: "delivered", submissionId }, { status: 201 });
  } catch (error) {
    lead.deliveryStatus = "email_pending";
    await put(recordPath, JSON.stringify(lead, null, 2), { access: "private", contentType: "application/json", allowOverwrite: true }).catch(() => undefined);
    console.error("project_submission_email_failed", { submissionId, error: error instanceof Error ? error.name : "unknown" });
    return Response.json({ ok: true, status: "stored_email_pending", submissionId, message: "Your project was stored securely. Email delivery is pending." }, { status: 202 });
  }
}
