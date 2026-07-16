# vinext-starter

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)

## Plan Your Project production workflow

Project requests are validated on the server, stored as private JSON records in Vercel Blob, and then delivered through Resend. Uploaded files remain private and are exposed to the internal email through expiring, HMAC-signed links. The business notification recipient is `info@luminixshades.com`.

Required production environment variables:

- `BLOB_READ_WRITE_TOKEN`: private Vercel Blob store used for submissions, uploads, and the distributed rate-limit records.
- `FILE_LINK_SECRET`: a long random secret used to hash rate-limit identities and sign private file links.
- `RESEND_API_KEY`: Resend transactional email credential.
- `PROJECT_EMAIL_FROM`: verified sender identity, recommended value `Luminix Shades <notifications@luminixshades.com>`.
- `PROJECT_INQUIRY_TO_EMAIL`: internal recipient; set to `info@luminixshades.com`.
- `ADMIN_EMAILS`: comma-separated email allowlist for the private `/admin` dashboard. Each administrator signs in with ChatGPT and must also appear in this list.

Do not expose these variables through a `NEXT_PUBLIC_` name. If Resend is temporarily unavailable, the API returns `stored_email_pending` only after the lead has been stored, so the project request is not lost.

### Email DNS checklist

DNS checked on July 15, 2026:

- SPF exists for `luminixshades.com`, but its current include is for the existing domain mail host. Add the exact Resend SPF record shown in the Resend domain-verification screen if Resend requires one; keep a single consolidated SPF TXT record.
- Google DKIM exists at `google._domainkey.luminixshades.com`. A Resend DKIM selector was not found, so the Resend-provided DKIM record still needs to be added before using `notifications@luminixshades.com` in production.
- DMARC exists at `_dmarc.luminixshades.com` with monitoring policy `p=none`. Review aggregate reports and move to an enforcement policy when all legitimate senders align.

Verify the domain in Resend after DNS changes and send a real inbox-and-spam-folder test before launch.
