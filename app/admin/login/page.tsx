import { redirect } from "next/navigation";
import { getAdminSession } from "../../lib/admin-session";
import AuthForm from "../AuthForm";
export const dynamic = "force-dynamic";
export const metadata = { title: "Administrator Sign In | Luminix Shades", robots: { index: false, follow: false } };
export default async function LoginPage() { if (await getAdminSession()) redirect("/admin"); return <AuthForm mode="login" />; }
