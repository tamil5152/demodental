"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { adminEmails, requireAdmin } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { getAuthClient, isAuthConfigured } from "@/lib/supabase/server";
import { isCloudApiConfigured, sendConfirmation, sendReviewRequest } from "@/lib/whatsapp";

export interface LoginState {
  error?: string;
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) return { error: "Supabase isn't configured yet. See the README." };
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await getAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Invalid email or password." };
  if (!adminEmails().includes(email)) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have admin access." };
  }
  redirect("/admin");
}

export async function signOut() {
  if (isAuthConfigured()) {
    const supabase = await getAuthClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

const statusSchema = z.object({
  id: z.uuid(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
});

export async function updateBookingStatus(formData: FormData) {
  await requireAdmin();
  const parsed = statusSchema.safeParse({ id: formData.get("id"), status: formData.get("status") });
  const db = getAdminClient();
  if (!parsed.success || !db) return;
  const { id, status } = parsed.data;

  const { data: booking, error } = await db
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select("reference, name, phone, service, appointment_date, appointment_time, confirmation_sent")
    .single();
  if (error || !booking) {
    console.error("status update failed", error);
    return;
  }

  // Automatic WhatsApp confirmation when the Cloud API is set up
  if (status === "confirmed" && !booking.confirmation_sent && isCloudApiConfigured()) {
    const res = await sendConfirmation(booking.phone, {
      reference: booking.reference,
      name: booking.name,
      service: booking.service,
      date: booking.appointment_date,
      time: booking.appointment_time,
    });
    if (res.ok) await db.from("bookings").update({ confirmation_sent: true }).eq("id", id);
    else console.error("confirmation send failed:", res.error);
  }
  revalidatePath("/admin");
}

export async function sendReview(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().safeParse(formData.get("id"));
  const db = getAdminClient();
  if (!id.success || !db || !isCloudApiConfigured()) return;
  const { data } = await db.from("bookings").select("name, phone").eq("id", id.data).single();
  if (!data) return;
  const res = await sendReviewRequest(data.phone, data.name.split(" ")[0] ?? data.name);
  if (res.ok) await db.from("bookings").update({ review_requested: true }).eq("id", id.data);
  else console.error("review request failed:", res.error);
  revalidatePath("/admin");
}

export async function markCallbackHandled(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().safeParse(formData.get("id"));
  const db = getAdminClient();
  if (!id.success || !db) return;
  await db.from("callback_requests").update({ handled: true }).eq("id", id.data);
  revalidatePath("/admin");
}
