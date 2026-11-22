import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { markCallbackHandled, sendReview, signOut, updateBookingStatus } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { clinic } from "@/lib/clinic";
import { addDays, clinicNow, formatDateLong, formatTime12 } from "@/lib/booking";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCloudApiConfigured, manualConfirmationMessage, serviceName, waLink } from "@/lib/whatsapp";

interface Booking {
  id: string;
  reference: string;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  confirmation_sent: boolean;
  review_requested: boolean;
}

interface Callback {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  created_at: string;
}

const views = [
  { key: "upcoming", label: "Upcoming" },
  { key: "pending", label: "Needs confirmation" },
  { key: "past", label: "Past" },
  { key: "callbacks", label: "Callback requests" },
] as const;

const badge: Record<Booking["status"], string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-brand-100 text-brand-900",
  completed: "bg-slate-200 text-slate-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-red-100 text-red-800",
};

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const email = await requireAdmin();
  const { view: rawView } = await searchParams;
  const view = views.find((v) => v.key === rawView)?.key ?? "upcoming";
  const db = getAdminClient();
  const today = clinicNow().date;

  let bookings: Booking[] = [];
  let callbacks: Callback[] = [];
  let todayCount = 0;
  let pendingCount = 0;
  let weekCount = 0;
  let error: string | null = null;

  if (!db) {
    error = "SUPABASE_SERVICE_ROLE_KEY isn't set, so bookings can't be loaded.";
  } else {
    const cols = "id, reference, name, phone, email, service, appointment_date, appointment_time, notes, status, confirmation_sent, review_requested";
    const active = ["pending", "confirmed"];
    const [t, p, w] = await Promise.all([
      db.from("bookings").select("id", { count: "exact", head: true }).eq("appointment_date", today).in("status", active),
      db.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
      db.from("bookings").select("id", { count: "exact", head: true }).gte("appointment_date", today).lte("appointment_date", addDays(today, 6)).in("status", active),
    ]);
    todayCount = t.count ?? 0;
    pendingCount = p.count ?? 0;
    weekCount = w.count ?? 0;

    if (view === "callbacks") {
      const res = await db.from("callback_requests").select("id, name, phone, message, created_at").eq("handled", false).order("created_at", { ascending: false }).limit(100);
      callbacks = (res.data as Callback[] | null) ?? [];
      error = res.error?.message ?? null;
    } else {
      let q = db.from("bookings").select(cols).limit(200);
      if (view === "upcoming") q = q.gte("appointment_date", today).in("status", active).order("appointment_date").order("appointment_time");
      else if (view === "pending") q = q.eq("status", "pending").order("appointment_date").order("appointment_time");
      else q = q.lt("appointment_date", today).order("appointment_date", { ascending: false }).order("appointment_time", { ascending: false });
      const res = await q;
      bookings = (res.data as Booking[] | null) ?? [];
      error = res.error?.message ?? null;
    }
  }

  const cloud = isCloudApiConfigured();

  return (
    <section className="container-x py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Appointments</h1>
          <p className="text-sm text-muted">Signed in as {email} · WhatsApp automation: {cloud ? "on" : "off (manual links)"}</p>
        </div>
        <form action={signOut}><button className="btn-ghost !min-h-10 !py-2 text-sm">Sign out</button></form>
      </div>

      <dl className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Today", todayCount],
          ["Next 7 days", weekCount],
          ["Awaiting confirmation", pendingCount],
        ].map(([label, n]) => (
          <div key={label} className="card !p-5">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="font-display text-3xl font-semibold text-brand-700">{n}</dd>
          </div>
        ))}
      </dl>

      <nav aria-label="Views" className="mb-6 flex flex-wrap gap-2">
        {views.map((v) => (
          <Link
            key={v.key}
            href={`/admin?view=${v.key}`}
            aria-current={v.key === view ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium ${v.key === view ? "bg-brand-700 text-white" : "border border-brand-100 bg-white hover:bg-brand-50"}`}
          >
            {v.label}
          </Link>
        ))}
      </nav>

      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}

      {view === "callbacks" ? (
        <ul className="space-y-3">
          {callbacks.length === 0 && <li className="card text-muted">No pending callback requests.</li>}
          {callbacks.map((c) => (
            <li key={c.id} className="card flex flex-wrap items-center justify-between gap-4 !p-4">
              <div>
                <p className="font-semibold">{c.name} · <a className="text-brand-700 underline" href={`tel:+${c.phone}`}>+{c.phone}</a></p>
                {c.message && <p className="text-sm text-muted">{c.message}</p>}
              </div>
              <div className="flex gap-2">
                <a href={waLink(undefined, c.phone)} target="_blank" rel="noopener noreferrer" className="btn-wa !min-h-9 !px-4 !py-1.5 text-sm">WhatsApp</a>
                <form action={markCallbackHandled}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="btn-ghost !min-h-9 !px-4 !py-1.5 text-sm">Mark done</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-3">
          {bookings.length === 0 && !error && <li className="card text-muted">Nothing here yet.</li>}
          {bookings.map((b) => (
            <li key={b.id} className="card !p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {formatDateLong(b.appointment_date)} · {formatTime12(b.appointment_time)}{" "}
                    <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge[b.status]}`}>{b.status.replace("_", " ")}</span>
                  </p>
                  <p className="mt-1 text-sm">{b.name} · {serviceName(b.service)} · <span className="text-muted">{b.reference}</span></p>
                  <p className="text-sm text-muted">
                    <a className="underline" href={`tel:+${b.phone}`}>+{b.phone}</a>
                    {b.email && <> · {b.email}</>}
                  </p>
                  {b.notes && <p className="mt-1 text-sm text-muted">“{b.notes}”</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {b.status === "pending" && (
                    <form action={updateBookingStatus}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="confirmed" />
                      <button className="btn-primary !min-h-9 !px-4 !py-1.5 text-sm">Confirm</button>
                    </form>
                  )}
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <>
                      {!cloud && (
                        <a
                          href={waLink(
                            manualConfirmationMessage({ reference: b.reference, name: b.name, service: b.service, date: b.appointment_date, time: b.appointment_time }),
                            b.phone,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-wa !min-h-9 !px-4 !py-1.5 text-sm"
                        >
                          <MessageCircle aria-hidden className="size-4" /> Send confirmation
                        </a>
                      )}
                      <form action={updateBookingStatus}>
                        <input type="hidden" name="id" value={b.id} />
                        <input type="hidden" name="status" value="completed" />
                        <button className="btn-ghost !min-h-9 !px-4 !py-1.5 text-sm">Completed</button>
                      </form>
                      <form action={updateBookingStatus}>
                        <input type="hidden" name="id" value={b.id} />
                        <input type="hidden" name="status" value="cancelled" />
                        <button className="btn-ghost !min-h-9 !px-4 !py-1.5 text-sm text-red-700">Cancel</button>
                      </form>
                    </>
                  )}
                  {b.status === "completed" && cloud && !b.review_requested && (
                    <form action={sendReview}>
                      <input type="hidden" name="id" value={b.id} />
                      <button className="btn-wa !min-h-9 !px-4 !py-1.5 text-sm">Ask for Google review</button>
                    </form>
                  )}
                  {b.status === "completed" && !cloud && (
                    <a
                      href={waLink(`Hi ${b.name.split(" ")[0]}, thank you for visiting! If you have a minute, we'd love your feedback: ${clinic.googleReviewLink}`, b.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-wa !min-h-9 !px-4 !py-1.5 text-sm"
                    >
                      Ask for review
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
