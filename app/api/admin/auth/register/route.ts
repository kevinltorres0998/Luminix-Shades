// @ts-expect-error Provided by the Cloudflare Workers runtime.
import { env } from "cloudflare:workers";
import { createSession, ensureAuthSchema, hashPassword, sha256 } from "../../../../lib/admin-session";

export const runtime = "edge";
export async function POST(request: Request) {
  await ensureAuthSchema();
  const body = await request.json().catch(() => null) as { email?: unknown; fullName?: unknown; password?: unknown; token?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : ""; const fullName = typeof body?.fullName === "string" ? body.fullName.trim().slice(0, 120) : ""; const password = typeof body?.password === "string" ? body.password : ""; const token = typeof body?.token === "string" ? body.token : "";
  if (!/^\S+@\S+\.\S+$/.test(email) || fullName.length < 2 || password.length < 10 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) return Response.json({ ok: false, error: "Use a valid email and a password of at least 10 characters with uppercase, lowercase and a number." }, { status: 422 });
  const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM admin_users").first<{ count: number }>(); const firstUser = (count?.count || 0) === 0;
  let inviteId = "";
  if (firstUser) {
    if (!process.env.ADMIN_BOOTSTRAP_TOKEN || token !== process.env.ADMIN_BOOTSTRAP_TOKEN) return Response.json({ ok: false, error: "This owner registration link is invalid." }, { status: 403 });
  } else {
    const invite = await env.DB.prepare("SELECT id,email FROM admin_invites WHERE token_hash=? AND accepted_at IS NULL AND expires_at>?").bind(await sha256(token), new Date().toISOString()).first<{ id: string; email: string }>();
    if (!invite || invite.email !== email) return Response.json({ ok: false, error: "This invitation is invalid or expired." }, { status: 403 }); inviteId = invite.id;
  }
  const credentials = await hashPassword(password); const id = crypto.randomUUID(); const now = new Date().toISOString();
  try { await env.DB.prepare("INSERT INTO admin_users(id,email,full_name,password_hash,password_salt,role,created_at) VALUES(?,?,?,?,?,?,?)").bind(id, email, fullName, credentials.hash, credentials.salt, "owner", now).run(); }
  catch { return Response.json({ ok: false, error: "An administrator already uses this email." }, { status: 409 }); }
  if (inviteId) await env.DB.prepare("UPDATE admin_invites SET accepted_at=? WHERE id=?").bind(now, inviteId).run();
  await createSession(id); return Response.json({ ok: true });
}
