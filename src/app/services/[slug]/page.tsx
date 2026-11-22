import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, Check, Clock, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { ServiceIcon } from "@/components/icons";
import { ServiceCard } from "@/components/ServiceCard";
import { clinic, services } from "@/lib/clinic";
import { serviceSchema } from "@/lib/seo";
import { waLink } from "@/lib/whatsapp";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  return {
    title: `${s.name} in ${clinic.address.city}`,
    description: s.short,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 4);

  return (
    <>
      <JsonLd data={serviceSchema(s)} />
      <section className="section bg-gradient-to-b from-brand-50 to-white !pb-10">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <Link href="/" className="hover:underline">Home</Link> / <Link href="/services" className="hover:underline">Treatments</Link> / <span className="text-ink">{s.name}</span>
          </nav>
          <div className="flex items-start gap-5">
            <span className="hidden size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 sm:flex">
              <ServiceIcon name={s.icon} className="size-8" />
            </span>
            <div>
              <h1 className="font-display text-4xl font-semibold sm:text-5xl">{s.name}</h1>
              <p className="mt-3 max-w-2xl text-lg text-muted">{s.short}</p>
              <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <span className="flex items-center gap-1.5"><Clock aria-hidden className="size-4 text-brand-700" /> {s.duration}</span>
                <span className="font-semibold text-brand-700">From {clinic.currency}{s.priceFrom.toLocaleString("en-IN")}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section !pt-6">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-10">
            <p className="max-w-3xl text-lg leading-relaxed">{s.description}</p>
            <div>
              <h2 className="mb-4 font-display text-2xl font-semibold">Benefits</h2>
              <ul className="space-y-3">
                {s.benefits.map((b) => (
                  <li key={b} className="flex gap-3"><Check aria-hidden className="mt-1 size-5 shrink-0 text-brand-700" /> {b}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 font-display text-2xl font-semibold">What to expect</h2>
              <ol className="grid gap-3 sm:grid-cols-2">
                {s.steps.map((step, i) => (
                  <li key={step} className="card flex items-center gap-4 !p-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="card !p-6">
              <p className="font-semibold">Ready to get started?</p>
              <p className="mb-5 mt-1 text-sm text-muted">Book online, or ask us a question first.</p>
              <Link href={`/book?service=${s.slug}`} className="btn-primary w-full"><CalendarCheck aria-hidden className="size-5" /> Book {s.name}</Link>
              <a
                href={waLink(`Hi ${clinic.shortName}, I'd like to know more about ${s.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa mt-3 w-full"
              >
                <MessageCircle aria-hidden className="size-5" /> Ask on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-surface !py-14">
        <div className="container-x">
          <h2 className="mb-6 font-display text-2xl font-semibold">Other treatments</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => <ServiceCard key={o.slug} service={o} />)}
          </div>
        </div>
      </section>
    </>
  );
}
