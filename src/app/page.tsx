import Link from "next/link";
import { CalendarCheck, Check, Clock, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { BeforeAfter } from "@/components/BeforeAfter";
import { CallbackForm } from "@/components/CallbackForm";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { ServiceCard } from "@/components/ServiceCard";
import { clinic, doctors, gallery, services, stats, testimonials, whyUs } from "@/lib/clinic";
import { faqSchema, hoursSummary } from "@/lib/seo";
import { GENERAL_ENQUIRY, waLink } from "@/lib/whatsapp";

export default function HomePage() {
  const hours = hoursSummary();
  return (
    <>
      <JsonLd data={faqSchema()} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="container-x grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Trusted dentists in {clinic.address.city}</p>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              A healthier, brighter smile, <span className="text-brand-700">without the fear.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Implants, braces, whitening, root canals and kids&apos; dentistry from a friendly team who explain every step and
              quote the price upfront.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="btn-primary">
                <CalendarCheck aria-hidden className="size-5" /> Book an Appointment
              </Link>
              <a href={waLink(GENERAL_ENQUIRY)} target="_blank" rel="noopener noreferrer" className="btn-wa">
                <MessageCircle aria-hidden className="size-5" /> Chat on WhatsApp
              </a>
            </div>
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Star aria-hidden className="size-4 fill-amber-400 text-amber-400" />
                <strong className="text-ink">{clinic.googleRating.score}</strong> from {clinic.googleRating.count}+ Google reviews
              </span>
              <span className="flex items-center gap-1"><Check aria-hidden className="size-4 text-brand-700" /> Free first consultation</span>
            </p>
          </div>

          {/* Illustration placeholder: swap for a clinic photo (public/hero.jpg) */}
          <div aria-hidden className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-brand-200 via-brand-100 to-white" />
            <svg viewBox="0 0 200 200" className="absolute inset-8 text-white drop-shadow-xl">
              <path
                fill="currentColor"
                stroke="#0f766e"
                strokeWidth="3"
                d="M100 30c-14-12-44-12-56 14-10 22 2 44 6 66 4 22 6 52 20 52 12 0 10-28 18-44 4-8 8-8 12-8s8 0 12 8c8 16 6 44 18 44 14 0 16-30 20-52 4-22 16-44 6-66-12-26-42-26-56-14Z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Clinic highlights" className="border-y border-brand-100 bg-white">
        <dl className="container-x grid grid-cols-2 gap-6 py-8 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-semibold text-brand-700">{s.value}</dd>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </dl>
      </section>

      {/* Services */}
      <section id="services" className="section bg-surface">
        <div className="container-x">
          <p className="eyebrow">Treatments</p>
          <h2 className="h2 max-w-2xl">Everything your family needs, under one roof</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
          </div>
        </div>
      </section>

      {/* Offer */}
      <section className="section !py-12">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-brand-900 p-8 text-white sm:flex-row sm:items-center sm:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">New patient offer</p>
              <p className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Free consultation + oral exam for first-time patients</p>
              <p className="mt-2 text-brand-100">Mention this offer when you book. Easy EMI plans on implants & braces.</p>
            </div>
            <Link href="/book?offer=new-patient" className="btn bg-white text-brand-900 hover:bg-brand-50">Claim the offer</Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section pt-4">
        <div className="container-x">
          <p className="eyebrow">Why {clinic.shortName}</p>
          <h2 className="h2 max-w-2xl">Dentistry that respects your time, comfort and budget</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((w) => (
              <li key={w.title} className="flex gap-4">
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Check aria-hidden className="size-4" />
                </span>
                <div>
                  <h3 className="font-semibold">{w.title}</h3>
                  <p className="mt-1 text-sm text-muted">{w.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How booking works */}
      <section className="section bg-brand-50">
        <div className="container-x">
          <p className="eyebrow">Simple booking</p>
          <h2 className="h2">Book in 2 minutes, get reminded on WhatsApp</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["1", "Pick a treatment & time", "Choose from live available slots, on mobile or desktop."],
              ["2", "Confirm on WhatsApp", "One tap sends your details to our team on WhatsApp."],
              ["3", "Get reminders", "We confirm your slot and remind you the day before."],
            ].map(([n, t, d]) => (
              <li key={n} className="card">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-700 font-semibold text-white">{n}</span>
                <h3 className="mt-4 font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ol>
          <Link href="/book" className="btn-primary mt-8">Book now</Link>
        </div>
      </section>

      {/* Doctors */}
      <section id="doctors" className="section">
        <div className="container-x">
          <p className="eyebrow">Meet the team</p>
          <h2 className="h2 max-w-2xl">Experienced specialists who listen first</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {doctors.map((d) => (
              <article key={d.name} className="card">
                <div aria-hidden className="mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-200 to-brand-500 font-display text-2xl font-semibold text-white">
                  {d.initials}
                </div>
                <h3 className="text-lg font-semibold">{d.name}</h3>
                <p className="text-sm text-brand-700">{d.role}</p>
                <p className="mt-1 text-xs text-muted">{d.experience} experience</p>
                <p className="mt-3 text-sm text-muted">{d.bio}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {d.specialties.map((s) => (
                    <li key={s} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-900">{s}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="section bg-surface">
        <div className="container-x">
          <p className="eyebrow">Real results</p>
          <h2 className="h2 max-w-2xl">Drag to see the difference</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {gallery.map((g) => <BeforeAfter key={g.title} {...g} />)}
          </div>
          <p className="mt-4 text-xs text-muted">Results vary by patient. Photos shown with consent.</p>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="section">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Patient stories</p>
              <h2 className="h2">Loved by {clinic.googleRating.count}+ patients</h2>
            </div>
            <a href={clinic.googleReviewLink} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <Star aria-hidden className="size-4 fill-amber-400 text-amber-400" /> Leave a Google review
            </a>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <figure key={t.name} className="card flex flex-col">
                <div role="img" aria-label={`${t.rating} out of 5 stars`} className="flex">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} aria-hidden className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <strong>{t.name}</strong> <span className="text-muted">· {t.treatment}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section bg-surface">
        <div className="container-x">
          <div className="mb-10 text-center">
            <p className="eyebrow">FAQ</p>
            <h2 className="h2">Questions we hear a lot</h2>
          </div>
          <Faq />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Visit us</p>
            <h2 className="h2">We&apos;re easy to find</h2>
            <ul className="mt-6 space-y-4 text-muted">
              <li className="flex gap-3">
                <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-brand-700" />
                <span>
                  {clinic.address.line1}, {clinic.address.city}, {clinic.address.region} {clinic.address.postalCode}{" "}
                  <a className="font-semibold text-brand-700 underline" href={clinic.mapsLink} target="_blank" rel="noopener noreferrer">Get directions</a>
                </span>
              </li>
              <li className="flex gap-3">
                <Phone aria-hidden className="mt-1 size-5 shrink-0 text-brand-700" />
                <a href={`tel:+${clinic.whatsappNumber}`}>{clinic.phone}</a>
              </li>
              <li className="flex gap-3">
                <Clock aria-hidden className="mt-1 size-5 shrink-0 text-brand-700" />
                <table className="text-sm">
                  <tbody>
                    {hours.map((h) => (
                      <tr key={h.days}>
                        <th scope="row" className="pr-6 text-left font-medium text-ink">{h.days}</th>
                        <td>{h.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </li>
            </ul>
            <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-brand-100">
              <iframe
                title={`Map showing ${clinic.name}`}
                src={clinic.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="size-full border-0"
              />
            </div>
          </div>
          <div className="card h-fit !p-8">
            <h3 className="font-display text-2xl font-semibold">Prefer a call?</h3>
            <p className="mb-6 mt-1 text-muted">Leave your number and we&apos;ll call you back during clinic hours.</p>
            <CallbackForm />
          </div>
        </div>
      </section>
    </>
  );
}
