import Link from "next/link";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { GENERAL_ENQUIRY, waLink } from "@/lib/whatsapp";

/** Floating WhatsApp button (desktop) + sticky Book/WhatsApp bar (mobile). */
export function FloatingActions() {
  const wa = waLink(GENERAL_ENQUIRY);
  return (
    <>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center rounded-full bg-wa text-ink shadow-lg ring-4 ring-white transition-transform hover:scale-105 sm:flex"
      >
        <MessageCircle aria-hidden className="size-7" />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-brand-100 bg-white/95 p-3 backdrop-blur sm:hidden">
        <Link href="/book" className="btn-primary !min-h-11 !px-3 !py-2 text-sm">
          <CalendarCheck aria-hidden className="size-4" /> Book Now
        </Link>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa !min-h-11 !px-3 !py-2 text-sm">
          <MessageCircle aria-hidden className="size-4" /> WhatsApp
        </a>
      </div>
    </>
  );
}
