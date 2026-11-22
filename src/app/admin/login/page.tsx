import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { adminEmails } from "@/lib/admin-auth";
import { getAuthClient, isAuthConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!isAuthConfigured()) {
    return (
      <section className="container-x max-w-xl py-16">
        <div className="card">
          <h1 className="font-display text-2xl font-semibold">Admin isn&apos;t set up yet</h1>
          <p className="mt-2 text-muted">
            Add your Supabase keys and <code>ADMIN_EMAILS</code> to <code>.env.local</code> (see <code>.env.example</code> and the README), then restart the server.
          </p>
        </div>
      </section>
    );
  }
  const supabase = await getAuthClient();
  const { data } = await supabase.auth.getUser();
  if (data.user?.email && adminEmails().includes(data.user.email.toLowerCase())) redirect("/admin");

  return (
    <section className="container-x max-w-md py-16">
      <div className="card !p-8">
        <h1 className="font-display text-2xl font-semibold">Clinic admin</h1>
        <p className="mb-6 mt-1 text-sm text-muted">Sign in to manage appointments.</p>
        <LoginForm />
      </div>
    </section>
  );
}
