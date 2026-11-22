import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { addDays, clinicNow } from "@/lib/booking";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCloudApiConfigured, sendReminder } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

function authorised(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Daily job (see vercel.json): WhatsApp reminders for tomorrow's confirmed appointments. */
export async function GET(req: NextRequest) {
  if (!authorised(req)) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const db = getAdminClient();
  if (!db || !isCloudApiConfigured()) {
    return NextResponse.json({ skipped: "Supabase or WhatsApp Cloud API not configured" });
  }

  const tomorrow = addDays(clinicNow().date, 1);
  const { data, error } = await db
    .from("bookings")
    .select("id, reference, name, phone, service, appointment_date, appointment_time")
    .eq("appointment_date", tomorrow)
    .eq("status", "confirmed")
    .eq("reminder_sent", false);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  const failures: string[] = [];
  for (const b of data ?? []) {
    const res = await sendReminder(b.phone, {
      reference: b.reference,
      name: b.name,
      service: b.service,
      date: b.appointment_date,
      time: b.appointment_time,
    });
    if (res.ok) {
      sent++;
      await db.from("bookings").update({ reminder_sent: true }).eq("id", b.id);
    } else {
      failures.push(`${b.reference}: ${res.error}`);
    }
  }
  return NextResponse.json({ date: tomorrow, total: data?.length ?? 0, sent, failures });
}
