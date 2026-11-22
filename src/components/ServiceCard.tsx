import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "@/components/icons";
import { clinic, type Service } from "@/lib/clinic";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="card group flex flex-col transition-shadow hover:shadow-md"
    >
      <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <ServiceIcon name={service.icon} className="size-6" />
      </span>
      <h3 className="text-lg font-semibold">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{service.short}</p>
      <p className="mt-4 flex items-center justify-between text-sm font-semibold text-brand-700">
        <span>From {clinic.currency}{service.priceFrom.toLocaleString("en-IN")}</span>
        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
      </p>
    </Link>
  );
}
