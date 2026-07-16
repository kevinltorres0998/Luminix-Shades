// @ts-expect-error Provided by the Cloudflare Workers runtime.
import { env } from "cloudflare:workers";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { name?: unknown; email?: unknown } | null;
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: "Please enter your name and a valid email address." }, { status: 422 });
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS marketing_subscribers (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, first_name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'subscribed', source TEXT NOT NULL DEFAULT 'private-list', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)").run();
  const now = new Date().toISOString();
  await env.DB.prepare("INSERT INTO marketing_subscribers(id,email,first_name,status,source,created_at,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET first_name=excluded.first_name,status='subscribed',updated_at=excluded.updated_at").bind(crypto.randomUUID(), email, name, "subscribed", "private-list", now, now).run();
  return Response.json({ ok: true, message: "Welcome to the Luminix private list." });
}
