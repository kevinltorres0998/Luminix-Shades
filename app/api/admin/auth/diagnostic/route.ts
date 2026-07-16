// @ts-expect-error Provided by the Cloudflare Workers runtime.
import { env } from "cloudflare:workers";
import { ensureAuthSchema, hashPassword } from "../../../../lib/admin-session";

export const runtime = "edge";
export async function POST(request: Request) {
  if (request.headers.get("x-bootstrap-token") !== process.env.ADMIN_BOOTSTRAP_TOKEN) return Response.json({ ok: false }, { status: 404 });
  try {
    await ensureAuthSchema();
    const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM admin_users").first<{ count: number }>();
    await hashPassword("DiagnosticPassword1");
    return Response.json({ ok: true, count: count?.count || 0 });
  } catch (error) {
    return Response.json({ ok: false, stage: "auth_storage", name: error instanceof Error ? error.name : "Unknown", message: error instanceof Error ? error.message : "Unknown" }, { status: 503 });
  }
}
