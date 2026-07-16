import { getChatGPTUser, requireChatGPTUser, type ChatGPTUser } from "../chatgpt-auth";

function configuredAdmins() {
  return new Set((process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
}

export function isAdminEmail(email: string) {
  return configuredAdmins().has(email.trim().toLowerCase());
}

export async function requireAdminPage(): Promise<ChatGPTUser> {
  const user = await requireChatGPTUser("/admin");
  if (!isAdminEmail(user.email)) throw new Error("ADMIN_ACCESS_DENIED");
  return user;
}

export async function getAdminApiUser(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  return user && isAdminEmail(user.email) ? user : null;
}
