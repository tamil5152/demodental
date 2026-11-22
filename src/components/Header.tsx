import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { clinic } from "@/lib/clinic";

export const nav = [
  { href: "/services", label: "Treatments" },
  { href: "/#doctors", label: "Our Team" },
  { href: "/#results", label: "Results" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/blog", label: "Dental Tips" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="whitespace-nowrap font-display text-xl font-semibold text-brand-900">
          {clinic.shortName}
          <span className="text-brand-500"> Dental</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-muted hover:text-brand-700">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={`tel:+${clinic.whatsappNumber}`} className="hidden items-center gap-2 text-sm font-semibold text-brand-900 xl:flex">
            <Phone aria-hidden className="size-4" /> {clinic.phone}
          </a>
          <Link href="/book" className="btn-primary whitespace-nowrap !min-h-10 !px-5 !py-2 text-sm">
            Book<span className="hidden sm:inline">&nbsp;Appointment</span>
          </Link>
          <details className="relative lg:hidden">
            <summary
              aria-label="Open menu"
              className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-brand-100 [&::-webkit-details-marker]:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </summary>
            <nav aria-label="Mobile" className="absolute right-0 mt-2 w-56 rounded-2xl border border-brand-100 bg-white p-2 shadow-lg">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-brand-50">
                  {n.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
