// @ts-expect-error Provided by the Cloudflare Workers runtime.
import { env } from "cloudflare:workers";
import { createSession, ensureAuthSchema, sha256, verifyPassword } from "../../../../lib/admin-session";

export const runtime = "edge";
export async function POST(request: Request) {
  await ensureAuthSchema();
  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"; const key = await sha256(`${ip}:${email}`); const now = new Date();
  const rate = await env.DB.prepare("SELECT attempts,window_started_at FROM admin_login_attempts WHERE key=?").bind(key).first<{ attempts: number; window_started_at: string }>();
  if (rate && now.getTime() - Date.parse(rate.window_started_at) < 15 * 60000 && rate.attempts >= 8) return Response.json({ ok: false, error: "Too many attempts. Please wait 15 minutes." }, { status: 429 });
  const user = await env.DB.prepare("SELECT id,password_hash,password_salt FROM admin_users WHERE email=? AND disabled_at IS NULL").bind(email).first<{ id: string; password_hash: string; password_salt: string }>();
  if (!user || !await verifyPassword(password, user.password_salt, user.password_hash)) {
    const reset = !rate || now.getTime() - Date.parse(rate.window_started_at) >= 15 * 60000;
    await env.DB.prepare("INSERT INTO admin_login_attempts(key,attempts,window_started_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET attempts=?,window_started_at=?").bind(key, reset ? 1 : rate.attempts + 1, reset ? now.toISOString() : rate.window_started_at, reset ? 1 : rate.attempts + 1, reset ? now.toISOString() : rate.window_started_at).run();
    return Response.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
  }
  await env.DB.batch([env.DB.prepare("DELETE FROM admin_login_attempts WHERE key=?").bind(key), env.DB.prepare("UPDATE admin_users SET last_login_at=? WHERE id=?").bind(now.toISOString(), user.id)]);
  await createSession(user.id); return Response.json({ ok: true });
}
