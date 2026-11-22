"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { CalendarPlus, Check, MessageCircle } from "lucide-react";
import { createBooking, getAvailableSlots } from "@/app/book/actions";
import { formatDateLong, formatTime12, googleCalendarLink, type BookingFormState } from "@/lib/booking";
import { clinic, services } from "@/lib/clinic";

const initial: BookingFormState = { ok: false };

interface Props {
  dates: string[];
  defaultService?: string;
  defaultNotes?: string;
}

function shortDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  return {
    weekday: new Intl.DateTimeFormat("en-IN", { weekday: "short", timeZone: "UTC" }).format(dt),
    rest: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }).format(dt),
  };
}

export function BookingForm({ dates, defaultService, defaultNotes }: Props) {
  const [state, action, pending] = useActionState(createBooking, initial);
  const [date, setDate] = useState<string>(state.values?.date ?? "");
  const [time, setTime] = useState<string>("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [loadingSlots, startSlots] = useTransition();
  const latestDate = useRef("");

  useEffect(() => {
    if (!date) return;
    latestDate.current = date;
    startSlots(async () => {
      const result = await getAvailableSlots(date);
      if (latestDate.current === date) {
        setSlots(result);
        setTime((t) => (result.includes(t) ? t : ""));
      }
    });
  }, [date]);

  if (state.ok && state.values) {
    const v = state.values;
    const svc = services.find((s) => s.slug === v.service);
    return (
      <div role="status" className="card !p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <Check aria-hidden className="size-7" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold">Request received, {v.name?.split(" ")[0]}!</h2>
        <p className="mt-2 text-muted">
          Reference <strong className="text-ink">{state.reference}</strong>. Send the pre-filled message on WhatsApp to
          confirm your slot with our team.
        </p>
        <dl className="mx-auto mt-6 max-w-sm space-y-1 rounded-xl bg-brand-50 p-4 text-left text-sm">
          <div className="flex justify-between gap-4"><dt className="text-muted">Treatment</dt><dd className="font-medium">{svc?.name}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">Date</dt><dd className="font-medium">{formatDateLong(v.date ?? "")}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">Time</dt><dd className="font-medium">{formatTime12(v.time ?? "")}</dd></div>
        </dl>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={state.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-wa">
            <MessageCircle aria-hidden className="size-5" /> Confirm on WhatsApp
          </a>
          <a
            href={googleCalendarLink({
              title: `Dental: ${svc?.name ?? "appointment"} at ${clinic.name}`,
              date: v.date ?? "",
              time: v.time ?? "",
              location: `${clinic.address.line1}, ${clinic.address.city}`,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <CalendarPlus aria-hidden className="size-5" /> Add to calendar
          </a>
        </div>
        <p className="mt-4 text-xs text-muted">Please arrive 10 minutes early. Need to change it? Message us on WhatsApp quoting your reference.</p>
      </div>
    );
  }

  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};

  return (
    <form action={action} className="card space-y-8 !p-6 sm:!p-8" noValidate>
      {state.message && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{state.message}</p>}

      <fieldset>
        <legend className="label">1. Treatment</legend>
        <select name="service" required defaultValue={v.service ?? defaultService ?? ""} className="field" aria-invalid={!!err.service}>
          <option value="" disabled>Choose a treatment…</option>
          {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
        {err.service && <p className="field-error">{err.service}</p>}
      </fieldset>

      <fieldset>
        <legend className="label">2. Date</legend>
        <div className="grid max-h-64 grid-cols-3 gap-2 overflow-auto p-1 sm:grid-cols-5">
          {dates.map((d) => {
            const s = shortDate(d);
            return (
              <label key={d} className="cursor-pointer">
                <input type="radio" name="date" value={d} checked={date === d} onChange={() => setDate(d)} className="peer sr-only" />
                <span className="flex flex-col items-center rounded-xl border border-slate-300 px-2 py-2 text-sm peer-checked:border-brand-700 peer-checked:bg-brand-700 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-brand-600">
                  <span className="text-xs opacity-80">{s.weekday}</span>
                  <span className="font-semibold">{s.rest}</span>
                </span>
              </label>
            );
          })}
        </div>
        {err.date && <p className="field-error">{err.date}</p>}
      </fieldset>

      <fieldset>
        <legend className="label">3. Time</legend>
        {!date && <p className="text-sm text-muted">Pick a date to see available times.</p>}
        {date && loadingSlots && slots === null && <p className="text-sm text-muted" aria-live="polite">Checking availability…</p>}
        {date && slots?.length === 0 && !loadingSlots && <p className="text-sm text-red-700">Fully booked. Please choose another day.</p>}
        {date && slots && slots.length > 0 && (
          <div className={`grid grid-cols-3 gap-2 sm:grid-cols-4 ${loadingSlots ? "opacity-50" : ""}`}>
            {slots.map((t) => (
              <label key={t} className="cursor-pointer">
                <input type="radio" name="time" value={t} checked={time === t} onChange={() => setTime(t)} className="peer sr-only" />
                <span className="block rounded-xl border border-slate-300 px-2 py-2 text-center text-sm font-medium peer-checked:border-brand-700 peer-checked:bg-brand-700 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-brand-600">
                  {formatTime12(t)}
                </span>
              </label>
            ))}
          </div>
        )}
        {err.time && <p className="field-error">{err.time}</p>}
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="label sm:col-span-2">4. Your details</legend>
        <div>
          <label htmlFor="b-name" className="label">Full name</label>
          <input id="b-name" name="name" autoComplete="name" required defaultValue={v.name} className="field" aria-invalid={!!err.name} />
          {err.name && <p className="field-error">{err.name}</p>}
        </div>
        <div>
          <label htmlFor="b-phone" className="label">WhatsApp number</label>
          <input id="b-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required defaultValue={v.phone} placeholder="98765 43210" className="field" aria-invalid={!!err.phone} />
          {err.phone && <p className="field-error">{err.phone}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="b-email" className="label">Email <span className="text-muted">(optional)</span></label>
          <input id="b-email" name="email" type="email" autoComplete="email" defaultValue={v.email} className="field" aria-invalid={!!err.email} />
          {err.email && <p className="field-error">{err.email}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="b-notes" className="label">Anything we should know? <span className="text-muted">(optional)</span></label>
          <textarea id="b-notes" name="notes" rows={3} maxLength={500} defaultValue={v.notes ?? defaultNotes} className="field" />
        </div>
      </fieldset>

      <div aria-hidden className="absolute -left-[9999px]">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div>
        <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto">
          {pending ? "Booking…" : "Request appointment"}
        </button>
        <p className="mt-3 text-xs text-muted">
          We&apos;ll use your number only to confirm and remind you about your appointment.
        </p>
      </div>
    </form>
  );
}
