import { get } from "@vercel/blob";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const submissionId = url.searchParams.get("id") || "";
  const pathname = url.searchParams.get("path") || "";
  const expires = Number(url.searchParams.get("expires"));
  const supplied = url.searchParams.get("signature") || "";
  const secret = process.env.FILE_LINK_SECRET;
  if (!secret || !/^[0-9a-f-]{36}$/i.test(submissionId) || !pathname.startsWith(`project-inquiries/${submissionId}/`) || !Number.isFinite(expires) || Date.now() > expires) return new Response("Link expired or invalid.", { status: 403 });
  const data = `${submissionId}:${pathname}:${expires}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const signature = Buffer.from(supplied, "base64url");
  const valid = await crypto.subtle.verify("HMAC", key, signature, new TextEncoder().encode(data)).catch(() => false);
  if (!valid) return new Response("Link expired or invalid.", { status: 403 });
  const blob = await get(pathname, { access: "private", useCache: true });
  if (!blob) return new Response("File not found.", { status: 404 });
  const headers = new Headers();
  blob.headers.forEach((value, key) => headers.set(key, value));
  headers.set("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(pathname.split("/").pop() || "project-file")}`);
  headers.set("Cache-Control", "private, max-age=300");
  return new Response(blob.stream, { headers });
}
