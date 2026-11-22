import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/clinic";

export function Faq() {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown aria-hidden className="size-5 shrink-0 text-brand-700 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
