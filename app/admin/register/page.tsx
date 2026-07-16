import AuthForm from "../AuthForm";
export const dynamic = "force-dynamic";
export const metadata = { title: "Create Administrator | Luminix Shades", robots: { index: false, follow: false } };
export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ token?: string; email?: string }> }) { const params = await searchParams; return <AuthForm mode="register" token={params.token || ""} invitedEmail={params.email || ""} />; }
