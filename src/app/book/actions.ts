"use server";

import {
  bookingSchema,
  makeReference,
  normalizePhone,
  slotsForDate,
  type BookingFormState,
  type BookingInput,
} from "@/lib/booking";
import { getAdminClient } from "@/lib/supabase/admin";
import { bookingMessage, waLink } from "@/lib/whatsapp";

const MAX_ACTIVE_PER_PHONE = 3;
const FIELDS = ["name", "phone", "email", "service", "date", "time", "notes", "website"] as const;

/** Open slots for a date: clinic hours minus slots already taken. Exposes no patient data. */
export async function getAvailableSlots(date: string): Promise<string[]> {
  const all = slotsForDate(date);
  if (all.length === 0) return [];
  const db = getAdminClient();
  if (!db) return all; // demo mode: nothing is stored, so nothing is taken
  const { data, error } = await db
    .from("bookings")
    .select("appointment_time")
    .eq("appointment_date", date)
    .in("status", ["pending", "confirmed"]);
  if (error) return all;
  const taken = new Set((data ?? []).map((r: { appointment_time: string }) => r.appointment_time));
  return all.filter((t) => !taken.has(t));
}

export async function createBooking(_prev: BookingFormState, formData: FormData): Promise<BookingFormState> {
  const values = Object.fromEntries(
    FIELDS.map((f) => [f, typeof formData.get(f) === "string" ? (formData.get(f) as string) : ""]),
  ) as Record<(typeof FIELDS)[number], string>;

  const parsed = bookingSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: BookingFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof BookingInput;
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors, values };
  }
  const input = parsed.data;
  const phone = normalizePhone(input.phone)!;

  if (!slotsForDate(input.date).includes(input.time)) {
    return { ok: false, message: "That time isn't available. Please choose another slot.", fieldErrors: { time: "Pick another time" }, values };
  }

  const db = getAdminClient();
  let reference = makeReference();

  if (db) {
    const { count } = await db
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("phone", phone)
      .in("status", ["pending", "confirmed"]);
    if ((count ?? 0) >= MAX_ACTIVE_PER_PHONE) {
      return {
        ok: false,
        message: "You already have several upcoming appointments. Please message us on WhatsApp to change them.",
        values,
      };
    }

    for (let attempt = 0; attempt < 3; attempt++) {
      const { error } = await db.from("bookings").insert({
        reference,
        name: input.name,
        phone,
        email: input.email || null,
        service: input.service,
        appointment_date: input.date,
        appointment_time: input.time,
        notes: input.notes || null,
      });
      if (!error) break;
      if (error.code === "23505") {
        if (error.message.includes("bookings_active_slot")) {
          return { ok: false, message: "Sorry, that slot was just taken. Please choose another time.", fieldErrors: { time: "Just taken" }, values };
        }
        reference = makeReference(); // reference collision: retry
        continue;
      }
      console.error("booking insert failed", error);
      return { ok: false, message: "Something went wrong saving your booking. Please try again or message us on WhatsApp.", values };
    }
  }

  const whatsappUrl = waLink(
    bookingMessage({ reference, name: input.name, service: input.service, date: input.date, time: input.time, notes: input.notes }),
  );
  return { ok: true, reference, whatsappUrl, values };
}
