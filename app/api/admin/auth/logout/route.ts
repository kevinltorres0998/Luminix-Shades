import { destroySession } from "../../../../lib/admin-session";
export const runtime = "edge";
export async function POST(request: Request) { await destroySession(); return Response.redirect(new URL("/admin/login", request.url), 303); }
