// @ts-expect-error Provided by the Cloudflare Workers runtime.
import { env } from "cloudflare:workers";
import { getAdminApiUser } from "../../../lib/admin-auth";
import { ensureAuthSchema, randomToken, sha256 } from "../../../lib/admin-session";

export const runtime = "edge";
export async function GET() { const admin = await getAdminApiUser(); if (!admin) return Response.json({ ok: false }, { status: 401 }); const result = await env.DB.prepare("SELECT id,email,full_name,role,created_at,last_login_at FROM admin_users WHERE disabled_at IS NULL ORDER BY created_at").all(); return Response.json({ ok: true, users: result.results }); }
export async function POST(request: Request) {
  const admin = await getAdminApiUser(); if (!admin || admin.role !== "owner") return Response.json({ ok: false, error: "Only the owner can invite administrators." }, { status: 403 });
  await ensureAuthSchema(); const body = await request.json().catch(() => null) as { email?: unknown } | null; const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  if (!/^\S+@\S+\.\S+$/.test(email)) return Response.json({ ok: false, error: "Enter a valid email." }, { status: 422 });
  const token = randomToken(); const now = new Date(); const expires = new Date(now.getTime() + 48 * 3600000);
  await env.DB.prepare("INSERT INTO admin_invites(id,email,token_hash,invited_by,created_at,expires_at) VALUES(?,?,?,?,?,?)").bind(crypto.randomUUID(), email, await sha256(token), admin.id, now.toISOString(), expires.toISOString()).run();
  const origin = new URL(request.url).origin; return Response.json({ ok: true, inviteUrl: `${origin}/admin/register?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}` });
}
