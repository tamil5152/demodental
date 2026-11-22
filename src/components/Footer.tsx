import Link from "next/link";
import { clinic, services } from "@/lib/clinic";
import { nav } from "@/components/Header";

export function Footer() {
  return (
    <footer className="bg-brand-900 pb-24 pt-14 text-brand-100 sm:pb-14">
      <div className="container-x grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-xl font-semibold text-white">{clinic.name}</p>
          <p className="mt-3 text-sm text-brand-200">{clinic.tagline}.</p>
          <div className="mt-4 flex gap-4 text-sm">
            <a className="underline-offset-4 hover:underline" href={clinic.social.instagram} rel="noopener noreferrer" target="_blank">Instagram</a>
            <a className="underline-offset-4 hover:underline" href={clinic.social.facebook} rel="noopener noreferrer" target="_blank">Facebook</a>
          </div>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Treatments</p>
          <ul className="space-y-2 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}><Link className="hover:text-white" href={`/services/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Explore</p>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}><Link className="hover:text-white" href={n.href}>{n.label}</Link></li>
            ))}
            <li><Link className="hover:text-white" href="/book">Book online</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-white">Visit us</p>
          <address className="not-italic leading-relaxed">
            {clinic.address.line1}<br />{clinic.address.city}, {clinic.address.region} {clinic.address.postalCode}
          </address>
          <p className="mt-3"><a className="hover:text-white" href={`tel:+${clinic.whatsappNumber}`}>{clinic.phone}</a></p>
          <p><a className="hover:text-white" href={`mailto:${clinic.email}`}>{clinic.email}</a></p>
        </div>
      </div>
      <div className="container-x mt-10 border-t border-brand-700 pt-6 text-xs text-brand-200">
        © {new Date().getFullYear()} {clinic.name}. All rights reserved. This site provides general information, not medical advice.
      </div>
    </footer>
  );
}
