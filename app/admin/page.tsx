import { requireAdminPage } from "../lib/admin-auth";
import { listProjectLeads, type AdminProjectLead } from "../lib/admin-leads";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administrator | Luminix Shades", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const user = await requireAdminPage();
  let leads: AdminProjectLead[] = [];
  let storageError = "";
  try { leads = await listProjectLeads(); } catch { storageError = "Project storage is not available. Check the production storage configuration."; }
  return <AdminDashboard initialLeads={leads} user={user} storageError={storageError} generatedAt={new Date().toISOString()} />;
}
