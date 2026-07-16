import { redirect } from "next/navigation";
import { getAdminSession, type AdminUser } from "./admin-session";

export async function requireAdminPage(): Promise<AdminUser> { const user = await getAdminSession(); if (!user) redirect("/admin/login"); return user; }
export async function getAdminApiUser(): Promise<AdminUser | null> { return getAdminSession(); }
