import { requireAdminPage } from "../lib/admin-auth";
import { listProjectLeads, type AdminProjectLead } from "../lib/admin-leads";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administrator | Luminix Shades", robots: { index: false, follow: false } };

export default async function AdminPage() {
  let user;
  try { user = await requireAdminPage(); }
  catch (error) {
    if (error instanceof Error && error.message === "ADMIN_ACCESS_DENIED") return <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#111313", color: "#fff", fontFamily: "Arial", textAlign: "center", padding: 24 }}><div><p style={{ color: "#caa56d", letterSpacing: ".16em", fontSize: 11 }}>LUMINIX SHADES</p><h1 style={{ fontFamily: "Georgia", fontWeight: 400 }}>Administrator access required.</h1><p style={{ color: "#aaa" }}>Your signed-in email is not included in the administrator list.</p><a href="/signout-with-chatgpt?return_to=/admin" style={{ color: "#e0bd82" }}>Sign in with another account</a></div></main>;
    throw error;
  }
  let leads: AdminProjectLead[] = [];
  let storageError = "";
  try { leads = await listProjectLeads(); } catch { storageError = "Project storage is not available. Check the production storage configuration."; }
  return <AdminDashboard initialLeads={leads} user={user} storageError={storageError} generatedAt={new Date().toISOString()} />;
}
