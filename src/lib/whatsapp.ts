import { clinic, services } from "@/lib/clinic";
import { formatDateLong, formatTime12 } from "@/lib/booking";

/** Click-to-chat link (works everywhere, no API needed). */
export function waLink(message?: string, number: string = clinic.whatsappNumber): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const GENERAL_ENQUIRY = `Hi ${clinic.shortName}! I'd like to know more about your dental services.`;

export interface BookingSummary {
  reference: string;
  name: string;
  service: string; // slug
  date: string;
  time: string;
  notes?: string | null;
}

export function serviceName(slug: string): string {
  return services.find((s) => s.slug === slug)?.name ?? slug;
}

/** Pre-filled message the patient sends to the clinic after booking. */
export function bookingMessage(b: BookingSummary): string {
  const lines = [
    `Hi ${clinic.shortName}, I'd like to confirm my appointment request.`,
    ``,
    `Ref: ${b.reference}`,
    `Name: ${b.name}`,
    `Treatment: ${serviceName(b.service)}`,
    `Date: ${formatDateLong(b.date)}`,
    `Time: ${formatTime12(b.time)}`,
  ];
  if (b.notes) lines.push(`Notes: ${b.notes}`);
  return lines.join("\n");
}

// ---------------- WhatsApp Cloud API (optional) ----------------

export function isCloudApiConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN);
}

const GRAPH = "https://graph.facebook.com/v21.0";

async function post(payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  if (!isCloudApiConfigured()) return { ok: false, error: "WhatsApp Cloud API not configured" };
  try {
    const res = await fetch(`${GRAPH}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { ok: false, error: `WhatsApp API ${res.status}: ${(await res.text()).slice(0, 300)}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "WhatsApp request failed" };
  }
}

/** Free-form text: only delivered inside the 24h customer-service window. */
export function sendText(to: string, body: string) {
  return post({ to, type: "text", text: { body, preview_url: true } });
}

/** Template message: required for business-initiated messages (confirmations, reminders). */
export function sendTemplate(to: string, name: string, bodyParams: string[]) {
  return post({
    to,
    type: "template",
    template: {
      name,
      language: { code: process.env.WHATSAPP_TEMPLATE_LANG ?? "en" },
      components: [
        { type: "body", parameters: bodyParams.map((text) => ({ type: "text", text })) },
      ],
    },
  });
}

/**
 * Body params, in order, for each template (create these in Meta Business Manager):
 *  confirmation: {{1}} name, {{2}} treatment, {{3}} date, {{4}} time, {{5}} reference
 *  reminder:     {{1}} name, {{2}} treatment, {{3}} date, {{4}} time
 *  review:       {{1}} name, {{2}} review link
 */
export function sendConfirmation(to: string, b: BookingSummary) {
  return sendTemplate(to, process.env.WHATSAPP_TEMPLATE_CONFIRMATION ?? "appointment_confirmation", [
    b.name,
    serviceName(b.service),
    formatDateLong(b.date),
    formatTime12(b.time),
    b.reference,
  ]);
}

export function sendReminder(to: string, b: BookingSummary) {
  return sendTemplate(to, process.env.WHATSAPP_TEMPLATE_REMINDER ?? "appointment_reminder", [
    b.name,
    serviceName(b.service),
    formatDateLong(b.date),
    formatTime12(b.time),
  ]);
}

export function sendReviewRequest(to: string, name: string) {
  return sendTemplate(to, process.env.WHATSAPP_TEMPLATE_REVIEW ?? "review_request", [
    name,
    clinic.googleReviewLink,
  ]);
}

/** Text the clinic can send manually (click-to-chat) when the Cloud API isn't configured. */
export function manualConfirmationMessage(b: BookingSummary): string {
  return [
    `Hello ${b.name}, this is ${clinic.name}.`,
    `Your appointment is confirmed:`,
    `${serviceName(b.service)}, ${formatDateLong(b.date)} at ${formatTime12(b.time)}.`,
    `Ref: ${b.reference}`,
    `${clinic.address.line1}, ${clinic.address.city}. See you soon!`,
  ].join("\n");
}
