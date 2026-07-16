import { get, list, put } from "@vercel/blob";
import type { ProjectLead } from "../api/project-inquiries/email";

export const leadStages = ["New Lead", "Consultation", "Measurement", "Proposal Sent", "Installation", "Completed"] as const;
export type LeadStage = typeof leadStages[number];
export type LeadNote = { id: string; text: string; author: string; createdAt: string };
export type AdminProjectLead = ProjectLead & { admin?: { stage?: LeadStage; assignedTo?: string; updatedAt?: string; notes?: LeadNote[] } };

async function readLead(pathname: string): Promise<AdminProjectLead | null> {
  const blob = await get(pathname, { access: "private", useCache: false }).catch(() => null);
  if (!blob) return null;
  return new Response(blob.stream).json().catch(() => null) as Promise<AdminProjectLead | null>;
}

export async function listProjectLeads() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Project storage is not configured.");
  const paths: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "project-inquiries/", cursor, limit: 1000 });
    paths.push(...page.blobs.map((blob) => blob.pathname).filter((path) => path.endsWith("/submission.json")));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && paths.length < 5000);
  const leads = (await Promise.all(paths.map(readLead))).filter((lead): lead is AdminProjectLead => Boolean(lead));
  return leads.sort((a, b) => Date.parse(b.receivedAt) - Date.parse(a.receivedAt));
}

export async function updateProjectLead(submissionId: string, update: { stage?: LeadStage; note?: string }, author: string) {
  const pathname = `project-inquiries/${submissionId}/submission.json`;
  const lead = await readLead(pathname);
  if (!lead) return null;
  const now = new Date().toISOString();
  const notes = [...(lead.admin?.notes || [])];
  if (update.note) notes.unshift({ id: crypto.randomUUID(), text: update.note, author, createdAt: now });
  const updated: AdminProjectLead = {
    ...lead,
    admin: { ...lead.admin, stage: update.stage || lead.admin?.stage || "New Lead", assignedTo: lead.admin?.assignedTo || author, updatedAt: now, notes },
  };
  await put(pathname, JSON.stringify(updated, null, 2), { access: "private", contentType: "application/json", allowOverwrite: true });
  return updated;
}
