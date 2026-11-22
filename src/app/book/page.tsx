import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { upcomingOpenDates } from "@/lib/booking";
import { services } from "@/lib/clinic";
import { GENERAL_ENQUIRY, waLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Book your dental appointment online in 2 minutes and confirm on WhatsApp.",
  alternates: { canonical: "/book" },
};

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string; offer?: string }> }) {
  const { service, offer } = await searchParams;
  const defaultService = services.some((s) => s.slug === service) ? service : undefined;

  return (
    <section className="section bg-surface">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="eyebrow">Appointments</p>
          <h1 className="h2 mb-2">Book your visit</h1>
          <p className="mb-8 text-muted">Pick a treatment and time. We&apos;ll confirm on WhatsApp and remind you the day before.</p>
          <BookingForm
            dates={upcomingOpenDates()}
            defaultService={defaultService}
            defaultNotes={offer === "new-patient" ? "New patient: free consultation offer" : undefined}
          />
        </div>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="card">
            <h2 className="font-semibold">Prefer to chat?</h2>
            <p className="mb-4 mt-1 text-sm text-muted">Message us directly for questions or same-day emergencies.</p>
            <a href={waLink(GENERAL_ENQUIRY)} target="_blank" rel="noopener noreferrer" className="btn-wa w-full">
              <MessageCircle aria-hidden className="size-5" /> WhatsApp us
            </a>
          </div>
          <div className="card text-sm text-muted">
            <h2 className="mb-2 font-semibold text-ink">Good to know</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Free first consultation for new patients</li>
              <li>Same-day slots need 1 hour&apos;s notice</li>
              <li>Free rescheduling up to 4 hours before</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
