import { z } from "zod";
import { clinic, services } from "@/lib/clinic";

const serviceSlugs = services.map((s) => s.slug) as [string, ...string[]];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Strip formatting; returns digits with country code, or null if implausible. */
export function normalizePhone(input: string, defaultCountryCode = "91"): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10) digits = defaultCountryCode + digits;
  else if (digits.length === 11 && digits.startsWith("0")) digits = defaultCountryCode + digits.slice(1);
  return digits.length >= 11 && digits.length <= 15 ? digits : null;
}

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .refine((v) => normalizePhone(v) !== null, "Enter a valid WhatsApp / mobile number"),
  email: z.union([z.literal(""), z.email("Enter a valid email")]).optional(),
  service: z.enum(serviceSlugs, { error: "Choose a service" }),
  date: z.string().regex(DATE_RE, "Choose a date"),
  time: z.string().regex(TIME_RE, "Choose a time"),
  notes: z.string().trim().max(500).optional(),
  // honeypot: real users leave this empty
  website: z.string().max(0).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export interface BookingFormState {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof BookingInput, string>>;
  whatsappUrl?: string;
  reference?: string;
  values?: Partial<Record<keyof BookingInput, string>>;
}

// ---- Dates & slots (clinic-local, no external date lib) ----

/** Current date/time parts in the clinic's timezone. */
export function clinicNow(now: Date = new Date()): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: clinic.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function fromMinutes(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Day of week (0=Sun) for a YYYY-MM-DD string, timezone independent. */
export function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).getUTCDay();
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, (d ?? 1) + days));
  return dt.toISOString().slice(0, 10);
}

/** All bookable start times for a date, ignoring existing bookings. Past slots are removed. */
export function slotsForDate(date: string, now: Date = new Date()): string[] {
  if (!DATE_RE.test(date)) return [];
  const today = clinicNow(now);
  if (date < today.date || date > addDays(today.date, clinic.bookingWindowDays)) return [];
  const hours = (clinic.hours as Record<number, { open: string; close: string; breakStart?: string; breakEnd?: string } | undefined>)[
    weekdayOf(date)
  ];
  if (!hours) return [];

  const slots: string[] = [];
  const end = toMinutes(hours.close);
  const breakStart = hours.breakStart ? toMinutes(hours.breakStart) : null;
  const breakEnd = hours.breakEnd ? toMinutes(hours.breakEnd) : null;
  for (let t = toMinutes(hours.open); t + clinic.slotMinutes <= end; t += clinic.slotMinutes) {
    const inBreak = breakStart !== null && breakEnd !== null && t < breakEnd && t + clinic.slotMinutes > breakStart;
    if (inBreak) continue;
    // need at least 60 minutes' notice for same-day bookings
    if (date === today.date && t < today.minutes + 60) continue;
    slots.push(fromMinutes(t));
  }
  return slots;
}

/** Dates (next N bookable days) the clinic is open. */
export function upcomingOpenDates(now: Date = new Date()): string[] {
  const today = clinicNow(now).date;
  const out: string[] = [];
  for (let i = 0; i <= clinic.bookingWindowDays; i++) {
    const d = addDays(today, i);
    if (slotsForDate(d, now).length > 0) out.push(d);
  }
  return out;
}

export function formatDateLong(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)));
}

export function formatTime12(hhmm: string): string {
  const mins = toMinutes(hhmm);
  const h = Math.floor(mins / 60);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(mins % 60).padStart(2, "0")} ${suffix}`;
}

/** Human readable booking reference, e.g. "BS-7K3Q9" (no ambiguous characters). */
export function makeReference(): string {
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  const code = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `${clinic.shortName.slice(0, 2).toUpperCase()}-${code}`;
}

/** "Add to Google Calendar" link for the patient. */
export function googleCalendarLink(opts: { title: string; date: string; time: string; location?: string }): string {
  const stamp = (mins: number) => `${opts.date.replaceAll("-", "")}T${fromMinutes(mins).replace(":", "")}00`;
  const start = toMinutes(opts.time);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${stamp(start)}/${stamp(Math.min(start + clinic.slotMinutes, 24 * 60 - 1))}`,
    ctz: clinic.timezone,
  });
  if (opts.location) params.set("location", opts.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
