"use client";

import { useActionState } from "react";
import { requestCallback, type CallbackState } from "@/app/contact/actions";

const initial: CallbackState = { ok: false };

export function CallbackForm() {
  const [state, action, pending] = useActionState(requestCallback, initial);

  if (state.ok) {
    return (
      <p role="status" className="rounded-2xl bg-brand-50 p-5 text-brand-900">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      <div>
        <label htmlFor="cb-name" className="label">Your name</label>
        <input id="cb-name" name="name" autoComplete="name" required className="field" />
      </div>
      <div>
        <label htmlFor="cb-phone" className="label">Phone / WhatsApp number</label>
        <input id="cb-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required className="field" placeholder="98765 43210" />
      </div>
      <div>
        <label htmlFor="cb-msg" className="label">How can we help? <span className="text-muted">(optional)</span></label>
        <textarea id="cb-msg" name="message" rows={3} maxLength={500} className="field" />
      </div>
      <div aria-hidden className="absolute -left-[9999px]">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {state.message && <p role="alert" className="field-error">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Sending…" : "Request a call back"}
      </button>
    </form>
  );
}
