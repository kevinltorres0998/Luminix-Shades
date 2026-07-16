import { getAdminApiUser } from "../../../lib/admin-auth";
import { leadStages, listProjectLeads, updateProjectLead, type LeadStage } from "../../../lib/admin-leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const denied = () => Response.json({ ok: false, error: "Administrator access required." }, { status: 403 });

export async function GET() {
  const user = await getAdminApiUser();
  if (!user) return denied();
  try { return Response.json({ ok: true, leads: await listProjectLeads() }); }
  catch { return Response.json({ ok: false, error: "Lead storage is unavailable." }, { status: 503 }); }
}

export async function PATCH(request: Request) {
  const user = await getAdminApiUser();
  if (!user) return denied();
  const body = await request.json().catch(() => null) as { submissionId?: unknown; stage?: unknown; note?: unknown } | null;
  const submissionId = typeof body?.submissionId === "string" ? body.submissionId : "";
  const stage = typeof body?.stage === "string" && leadStages.includes(body.stage as LeadStage) ? body.stage as LeadStage : undefined;
  const note = typeof body?.note === "string" ? body.note.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, 2000) : undefined;
  if (!/^[0-9a-f-]{36}$/i.test(submissionId) || (!stage && !note)) return Response.json({ ok: false, error: "Invalid update." }, { status: 422 });
  try {
    const lead = await updateProjectLead(submissionId, { stage, note }, user.email);
    return lead ? Response.json({ ok: true, lead }) : Response.json({ ok: false, error: "Lead not found." }, { status: 404 });
  } catch { return Response.json({ ok: false, error: "The lead could not be updated." }, { status: 503 }); }
}
