# BrightSmile Dental: clinic website with WhatsApp booking

Next.js 16 (React 19, App Router) · TypeScript strict · Tailwind v4 · Supabase.

> **All clinic details, doctors, reviews and prices are SAMPLE content**: edit `src/lib/clinic.ts` (the single source of truth) before launch. The Rootnode Solutions growth-plan document wasn't available when this was built, so the feature set follows a typical dental growth plan. Compare it with the real plan and tell me what's missing.

## Features

| Area | What's included |
|---|---|
| Conversion | Hero CTAs, sticky mobile Book/WhatsApp bar, floating WhatsApp button, new-patient offer, "prefer a call?" callback form |
| Online booking | Live available slots (clinic hours, lunch break, 1h notice, 45-day window), double-booking prevented by a DB unique index, honeypot spam trap, max 3 active bookings per phone, add-to-Google-Calendar |
| WhatsApp (click-to-chat) | After booking, a pre-filled message (ref, treatment, date, time) opens in WhatsApp to the clinic. Needs no API |
| WhatsApp (Cloud API, optional) | Confirmation on admin "Confirm", reminder the day before (cron), Google-review request after treatment, inbound webhook auto-reply with booking link |
| Admin dashboard `/admin` | Supabase login limited to `ADMIN_EMAILS`; today / week / pending counts; confirm / complete / cancel; manual WhatsApp links when the API is off; callback requests |
| Trust & results | Doctors, 4.9★ Google rating, testimonials with "Leave a Google review", before/after sliders, FAQ |
| SEO | Per-treatment pages, blog, `Dentist` / `FAQPage` / `MedicalProcedure` / `BlogPosting` JSON-LD, sitemap, robots, canonical + OG metadata |
| Quality | Semantic HTML, skip link, keyboard-operable forms, reduced-motion, no horizontal scroll at 390px |

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

With no env vars the site runs in **demo mode**: booking validates and opens the WhatsApp message, but nothing is stored and `/admin` shows a setup notice.

## Turn on bookings + admin (Supabase)

1. Create a Supabase project and run `supabase/migrations/0001_init.sql` in the SQL editor.
2. Authentication → Providers → Email: **disable sign-ups**, then add the clinic owner under Users.
3. Fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS`.

Tables have RLS enabled with no policies. All reads and writes go through server code with the service-role key (never sent to the browser).

## Turn on WhatsApp automation (Cloud API)

1. In Meta Business, create a WhatsApp app, get the phone number ID and a permanent token.
2. Create and get approved three **template** messages (business-initiated messages require templates):
   - `appointment_confirmation`: `{{1}}` name, `{{2}}` treatment, `{{3}}` date, `{{4}}` time, `{{5}}` reference
   - `appointment_reminder`: `{{1}}` name, `{{2}}` treatment, `{{3}}` date, `{{4}}` time
   - `review_request`: `{{1}}` name, `{{2}}` review link
3. Set the `WHATSAPP_*` vars. Point the webhook at `https://YOUR-SITE/api/whatsapp/webhook` with your verify token (the app secret is used to verify signatures).
4. Reminders: `vercel.json` schedules `/api/cron/reminders` daily at 09:00 IST. Set `CRON_SECRET` (Vercel sends it as a Bearer token).

## Before launch checklist

- [ ] Replace sample details in `src/lib/clinic.ts` (name, phone, WhatsApp number, address, hours, prices, doctors, reviews, Google review link, map embed)
- [ ] Add real before/after photos to `public/gallery` and set the paths in `gallery`
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the live domain
- [ ] Test a booking end-to-end on a real phone

## Scripts

`npm run dev` · `npm run build` · `npm test` (Vitest) · `npm run typecheck`
