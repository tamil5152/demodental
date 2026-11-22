import type { Metadata } from "next";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "Dental Treatments & Prices",
  description: "Check-ups, whitening, implants, braces, root canals, kids' dentistry and emergency care, with transparent starting prices.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <section className="section bg-surface">
      <div className="container-x">
        <p className="eyebrow">Treatments</p>
        <h1 className="h2 max-w-2xl">Complete dental care, with clear starting prices</h1>
        <p className="mt-3 max-w-2xl text-muted">Final cost depends on your examination. You always get a written estimate before we begin.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
        </div>
      </div>
    </section>
  );
}
