import { clinic, faqs, type Service } from "@/lib/clinic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function dentistSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinic.name,
    url: siteUrl,
    telephone: `+${clinic.whatsappNumber}`,
    email: clinic.email,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.line1,
      addressLocality: clinic.address.city,
      addressRegion: clinic.address.region,
      postalCode: clinic.address.postalCode,
      addressCountry: clinic.address.country,
    },
    openingHoursSpecification: Object.entries(clinic.hours).map(([day, h]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayNames[Number(day)],
      opens: h.open,
      closes: h.close,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: clinic.googleRating.score,
      reviewCount: clinic.googleRating.count,
    },
    sameAs: [clinic.social.instagram, clinic.social.facebook],
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: s.name,
    description: s.description,
    procedureType: "https://schema.org/NoninvasiveProcedure",
    provider: { "@type": "Dentist", name: clinic.name, url: siteUrl },
  };
}

export function hoursSummary(): { days: string; time: string }[] {
  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const hh = (h ?? 0) % 12 === 0 ? 12 : (h ?? 0) % 12;
    return `${hh}${m ? `:${String(m).padStart(2, "0")}` : ""} ${(h ?? 0) >= 12 ? "pm" : "am"}`;
  };
  return [0, 1, 2, 3, 4, 5, 6].map((d) => {
    const h = clinic.hours[d];
    return { days: dayNames[d]!, time: h ? `${fmt(h.open)} – ${fmt(h.close)}` : "Closed (emergencies on WhatsApp)" };
  });
}
