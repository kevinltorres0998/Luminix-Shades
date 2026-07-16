// @ts-expect-error Provided by the Cloudflare Workers runtime.
import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

export type AdminUser = { id: string; email: string; displayName: string; fullName: string; role: "owner" | "admin" };
export const SESSION_COOKIE = "luminix_admin_session";
const encoder = new TextEncoder();

export async function sha256(value: string) { return Buffer.from(await crypto.subtle.digest("SHA-256", encoder.encode(value))).toString("hex"); }
export function randomToken(bytes = 32) { const value = new Uint8Array(bytes); crypto.getRandomValues(value); return Buffer.from(value).toString("base64url"); }
export async function hashPassword(password: string, salt = randomToken(18)) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(salt), iterations: 100000 }, key, 256);
  return { salt, hash: Buffer.from(bits).toString("base64url") };
}
export async function verifyPassword(password: string, salt: string, expected: string) {
  const actual = (await hashPassword(password, salt)).hash;
  if (actual.length !== expected.length) return false;
  let difference = 0; for (let i = 0; i < actual.length; i++) difference |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return difference === 0;
}
export async function ensureAuthSchema() {
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, full_name TEXT NOT NULL, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', created_at TEXT NOT NULL, last_login_at TEXT, disabled_at TEXT)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS admin_sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL, expires_at TEXT NOT NULL)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS admin_sessions_token_idx ON admin_sessions(token_hash)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS admin_invites (id TEXT PRIMARY KEY, email TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE, invited_by TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL, accepted_at TEXT)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS admin_login_attempts (key TEXT PRIMARY KEY, attempts INTEGER NOT NULL DEFAULT 0, window_started_at TEXT NOT NULL)"),
  ]);
}
export async function getAdminSession(): Promise<AdminUser | null> {
  await ensureAuthSchema();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = await env.DB.prepare("SELECT u.id, u.email, u.full_name, u.role FROM admin_sessions s JOIN admin_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.disabled_at IS NULL").bind(await sha256(token), new Date().toISOString()).first<{ id: string; email: string; full_name: string; role: "owner" | "admin" }>();
  return row ? { id: row.id, email: row.email, fullName: row.full_name, displayName: row.full_name, role: row.role } : null;
}
export async function createSession(userId: string) {
  const token = randomToken(); const now = new Date(); const expires = new Date(now.getTime() + 14 * 86400000);
  await env.DB.prepare("INSERT INTO admin_sessions (id,user_id,token_hash,created_at,expires_at) VALUES (?,?,?,?,?)").bind(crypto.randomUUID(), userId, await sha256(token), now.toISOString(), expires.toISOString()).run();
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", expires });
}
export async function destroySession() {
  const jar = await cookies(); const token = jar.get(SESSION_COOKIE)?.value;
  if (token) { await ensureAuthSchema(); await env.DB.prepare("DELETE FROM admin_sessions WHERE token_hash=?").bind(await sha256(token)).run(); }
  jar.set(SESSION_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
}
