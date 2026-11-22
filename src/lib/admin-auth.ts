import "server-only";
import { redirect } from "next/navigation";
import { getAuthClient, isAuthConfigured } from "@/lib/supabase/server";

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Returns the signed-in admin's email, or redirects to the login page. */
export async function requireAdmin(): Promise<string> {
  if (!isAuthConfigured()) redirect("/admin/login");
  const supabase = await getAuthClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email || !adminEmails().includes(email)) redirect("/admin/login");
  return email;
}
