import { conciergeFallbackReply, conciergeSystemPrompt, type ConciergeMessage } from "../../lib/ai-concierge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const LIMIT = 8;
const MAX_MESSAGES = 14;
const MAX_MESSAGE_LENGTH = 1_200;
const MAX_TOTAL_LENGTH = 8_000;
const attempts = new Map<string, number[]>();

const error = (message: string, status: number) => Response.json({ ok: false, error: message }, { status });
const clientId = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";

function allowed(request: Request) {
  const now = Date.now();
  const id = clientId(request);
  const recent = (attempts.get(id) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= LIMIT) return false;
  recent.push(now); attempts.set(id, recent);
  if (attempts.size > 500) for (const [key, values] of attempts) if (!values.some((time) => now - time < WINDOW_MS)) attempts.delete(key);
  return true;
}

function parseMessages(value: unknown): ConciergeMessage[] | null {
  if (!Array.isArray(value)) return null;
  const messages = value.slice(-MAX_MESSAGES).map((item) => {
    if (!item || typeof item !== "object") return null;
    const role = (item as Record<string, unknown>).role;
    const raw = (item as Record<string, unknown>).content;
    if ((role !== "user" && role !== "assistant") || typeof raw !== "string") return null;
    const content = raw.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ").trim().slice(0, MAX_MESSAGE_LENGTH);
    return content ? { role, content } as ConciergeMessage : null;
  }).filter((message): message is ConciergeMessage => Boolean(message));
  if (!messages.length || messages[messages.length - 1].role !== "user" || messages.reduce((sum, message) => sum + message.content.length, 0) > MAX_TOTAL_LENGTH) return null;
  return messages;
}

function outputText(body: unknown) {
  if (!body || typeof body !== "object") return "";
  const output = (body as { output?: unknown[] }).output;
  if (!Array.isArray(output)) return "";
  return output.flatMap((item) => item && typeof item === "object" && Array.isArray((item as { content?: unknown[] }).content) ? (item as { content: unknown[] }).content : []).map((part) => part && typeof part === "object" && (part as { type?: unknown }).type === "output_text" && typeof (part as { text?: unknown }).text === "string" ? (part as { text: string }).text : "").join("\n").trim();
}

export async function POST(request: Request) {
  const openAIKey = process.env.OPENAI_API_KEY;
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  if (!allowed(request)) return error("rate_limited", 429);
  const body = await request.json().catch(() => null) as { messages?: unknown } | null;
  const messages = parseMessages(body?.messages);
  if (!messages) return error("invalid_messages", 400);
  const fallback = () => Response.json({ ok: true, reply: conciergeFallbackReply(messages[messages.length - 1].content) });
  if (!openAIKey && !gatewayKey) return fallback();

  try {
    const usingGateway = !openAIKey;
    const response = await fetch(usingGateway ? "https://ai-gateway.vercel.sh/v1/responses" : "https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${openAIKey || gatewayKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || (usingGateway ? "openai/gpt-5.6-luna" : "gpt-5.6-luna"),
        instructions: conciergeSystemPrompt,
        input: messages,
        max_output_tokens: 500,
        reasoning: { effort: "none" },
        store: false,
      }),
      signal: AbortSignal.timeout(22_000),
    });
    if (!response.ok) return fallback();
    const reply = outputText(await response.json());
    if (!reply) return fallback();
    return Response.json({ ok: true, reply: reply.slice(0, 3_500) });
  } catch {
    return fallback();
  }
}
