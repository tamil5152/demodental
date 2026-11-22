"use server";

import { z } from "zod";
import { normalizePhone } from "@/lib/booking";
import { getAdminClient } from "@/lib/supabase/admin";

export interface CallbackState {
  ok: boolean;
  message?: string;
}

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().refine((v) => normalizePhone(v) !== null, "Enter a valid phone number"),
  message: z.string().trim().max(500).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export async function requestCallback(_prev: CallbackState, formData: FormData): Promise<CallbackState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    message: formData.get("message") ?? "",
    website: formData.get("website") ?? "",
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check your details." };

  const db = getAdminClient();
  if (db) {
    const { error } = await db.from("callback_requests").insert({
      name: parsed.data.name,
      phone: normalizePhone(parsed.data.phone),
      message: parsed.data.message || null,
    });
    if (error) {
      console.error("callback insert failed", error);
      return { ok: false, message: "Couldn't send your request. Please message us on WhatsApp." };
    }
  }
  return { ok: true, message: "Thanks! We'll call you back shortly (within working hours)." };
}
