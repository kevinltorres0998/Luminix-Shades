// Public Vercel builds do not serve the private Cloudflare-backed admin APIs.
// This compile-time shim keeps those route modules isolated from the website.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const env: { DB: any } = { DB: undefined };
