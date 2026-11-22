/**
 * Single source of truth for clinic details and site content.
 *
 * Everything marked SAMPLE is placeholder content: replace it with the real
 * clinic's name, phone, doctors, reviews and prices before going live.
 */

export const clinic = {
  name: "BrightSmile Dental Clinic", // SAMPLE
  shortName: "BrightSmile",
  tagline: "Gentle, modern dentistry for the whole family",
  phone: "+91 98765 43210", // SAMPLE
  /** Digits only, with country code, no "+" (used for wa.me links) */
  whatsappNumber: "919876543210", // SAMPLE
  email: "hello@brightsmile.example", // SAMPLE
  address: {
    line1: "12, Lake View Road", // SAMPLE
    city: "Chennai",
    region: "Tamil Nadu",
    postalCode: "600001",
    country: "IN",
  },
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Chennai%2C%20Tamil%20Nadu&output=embed", // SAMPLE
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Chennai",
  googleReviewLink: "https://g.page/r/REPLACE_WITH_PLACE_ID/review", // SAMPLE
  googleRating: { score: 4.9, count: 312 }, // SAMPLE
  social: {
    instagram: "https://instagram.com/", // SAMPLE
    facebook: "https://facebook.com/", // SAMPLE
  },
  currency: "₹",
  /** IANA timezone used to decide which slots are in the past */
  timezone: "Asia/Kolkata",
  /** 0 = Sunday ... 6 = Saturday. Missing days are closed. */
  hours: {
    1: { open: "09:00", close: "19:00", breakStart: "13:00", breakEnd: "14:00" },
    2: { open: "09:00", close: "19:00", breakStart: "13:00", breakEnd: "14:00" },
    3: { open: "09:00", close: "19:00", breakStart: "13:00", breakEnd: "14:00" },
    4: { open: "09:00", close: "19:00", breakStart: "13:00", breakEnd: "14:00" },
    5: { open: "09:00", close: "19:00", breakStart: "13:00", breakEnd: "14:00" },
    6: { open: "09:00", close: "15:00" },
  } as Record<number, DayHours>,
  slotMinutes: 30,
  /** How far ahead patients may book */
  bookingWindowDays: 45,
} as const;

export interface DayHours {
  open: string;
  close: string;
  breakStart?: string;
  breakEnd?: string;
}

export const stats = [
  { value: "12+", label: "Years of experience" },
  { value: "15,000+", label: "Happy patients" },
  { value: "4.9★", label: "Google rating" },
  { value: "0", label: "Pain-free promise" },
] as const;

export interface Service {
  slug: string;
  name: string;
  icon: "sparkles" | "shield" | "smile" | "wrench" | "baby" | "zap" | "activity" | "heart";
  short: string;
  description: string;
  benefits: string[];
  duration: string;
  /** Starting price in INR; "from" pricing only */
  priceFrom: number;
  steps: string[];
}

// SAMPLE prices: replace with the clinic's real price list
export const services: Service[] = [
  {
    slug: "general-checkup",
    name: "Check-up & Cleaning",
    icon: "shield",
    short: "Thorough exam, scaling and polishing to keep problems from starting.",
    description:
      "A complete oral exam with digital X-rays when needed, professional scaling and polishing, and a clear plan for your oral health. Regular check-ups catch cavities and gum disease early, when treatment is simplest and cheapest.",
    benefits: ["Early cavity & gum disease detection", "Fresher breath, brighter teeth", "Personalised home-care advice"],
    duration: "30 – 45 min",
    priceFrom: 500,
    steps: ["Oral exam & X-rays", "Ultrasonic scaling", "Polishing & fluoride", "Care plan"],
  },
  {
    slug: "teeth-whitening",
    name: "Teeth Whitening",
    icon: "sparkles",
    short: "Up to 8 shades brighter in a single comfortable visit.",
    description:
      "Safe, dentist-supervised whitening that lifts years of tea, coffee and tobacco stains. We protect your gums, tailor the strength to your sensitivity and finish with a take-home maintenance kit.",
    benefits: ["Visible results in one visit", "Gentle on sensitive teeth", "Maintenance kit included"],
    duration: "60 min",
    priceFrom: 6000,
    steps: ["Shade assessment", "Gum protection", "Whitening gel & light", "Aftercare kit"],
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    icon: "wrench",
    short: "Permanent, natural-looking replacement for missing teeth.",
    description:
      "Titanium implants that look, feel and function like natural teeth. We plan every case with 3D imaging, so placement is precise, healing is quicker and the result lasts for decades.",
    benefits: ["Looks & feels natural", "Preserves jawbone", "Long-term solution"],
    duration: "Planned in stages",
    priceFrom: 28000,
    steps: ["3D scan & planning", "Implant placement", "Healing period", "Crown fitting"],
  },
  {
    slug: "braces-aligners",
    name: "Braces & Clear Aligners",
    icon: "smile",
    short: "Straighter teeth with metal, ceramic or invisible options.",
    description:
      "From classic metal braces to nearly invisible aligners, we'll find the right way to straighten your teeth for your budget and lifestyle. You see your predicted result before you start.",
    benefits: ["Free smile simulation", "Options for every budget", "Flexible EMI payment plans"],
    duration: "6 – 24 months",
    priceFrom: 25000,
    steps: ["Scan & smile simulation", "Treatment plan", "Fitting", "Regular adjustments", "Retainers"],
  },
  {
    slug: "root-canal",
    name: "Painless Root Canal",
    icon: "activity",
    short: "Save the natural tooth, with modern rotary tools and effective anaesthesia.",
    description:
      "Root canal treatment today is quick and comfortable. We clean the infection, seal the tooth and protect it with a crown, so you can keep your natural tooth and get rid of the pain for good.",
    benefits: ["Relieves toothache fast", "Saves the natural tooth", "Often completed in 1–2 visits"],
    duration: "45 – 90 min",
    priceFrom: 3500,
    steps: ["Numbing & isolation", "Cleaning the canals", "Sealing", "Crown protection"],
  },
  {
    slug: "kids-dentistry",
    name: "Kids' Dentistry",
    icon: "baby",
    short: "Friendly, fear-free care that builds healthy habits early.",
    description:
      "A calm, playful environment and a gentle approach make first visits easy. We offer fluoride treatment, sealants, and habit-correction advice, and we'll teach your child to enjoy brushing.",
    benefits: ["Gentle, fear-free approach", "Sealants & fluoride", "Parents welcome in the room"],
    duration: "30 min",
    priceFrom: 400,
    steps: ["Meet & greet", "Gentle exam", "Fluoride / sealants", "Brushing lesson"],
  },
  {
    slug: "smile-makeover",
    name: "Smile Makeover",
    icon: "heart",
    short: "Veneers, bonding and shaping, designed around your face.",
    description:
      "A tailor-made combination of veneers, composite bonding, whitening and gum contouring to give you a natural smile you'll love. We preview your design before any work begins.",
    benefits: ["Digital smile design preview", "Natural-looking materials", "Fully personalised"],
    duration: "2 – 3 visits",
    priceFrom: 8000,
    steps: ["Consultation & photos", "Digital design", "Preparation", "Final fitting"],
  },
  {
    slug: "emergency-care",
    name: "Emergency Dental Care",
    icon: "zap",
    short: "Same-day appointments for pain, swelling and broken teeth.",
    description:
      "Severe toothache, a knocked-out or cracked tooth, swelling, or a lost filling: we keep slots free every day for emergencies. Message us on WhatsApp and we'll get you seen quickly.",
    benefits: ["Same-day slots", "Immediate pain relief", "WhatsApp triage"],
    duration: "30 – 60 min",
    priceFrom: 600,
    steps: ["Quick triage", "Pain relief", "Treatment or temporary fix", "Follow-up plan"],
  },
];

export interface Doctor {
  name: string;
  role: string;
  experience: string;
  bio: string;
  specialties: string[];
  initials: string;
}

// SAMPLE people: replace with real team members and photos
export const doctors: Doctor[] = [
  {
    name: "Dr. Ananya Rao",
    role: "Founder & Lead Dentist, BDS, MDS (Prosthodontics)",
    experience: "14 years",
    bio: "Ananya leads our implant and smile design work and believes the best dentistry is the kind you forget you've had.",
    specialties: ["Implants", "Smile design", "Crowns & bridges"],
    initials: "AR",
  },
  {
    name: "Dr. Karthik Menon",
    role: "Orthodontist, BDS, MDS (Orthodontics)",
    experience: "10 years",
    bio: "Karthik straightens smiles for teens and adults, from classic braces to clear aligners.",
    specialties: ["Braces", "Clear aligners", "Jaw alignment"],
    initials: "KM",
  },
  {
    name: "Dr. Meera Iyer",
    role: "Paediatric & Endodontic Dentist, BDS, MDS",
    experience: "8 years",
    bio: "Meera is our go-to for anxious little patients and for saving teeth with painless root canals.",
    specialties: ["Kids' dentistry", "Root canals", "Preventive care"],
    initials: "MI",
  },
];

export interface Testimonial {
  name: string;
  treatment: string;
  quote: string;
  rating: 5;
}

// SAMPLE reviews: replace with genuine patient reviews (with permission)
export const testimonials: Testimonial[] = [
  {
    name: "Priya S.",
    treatment: "Teeth Whitening",
    quote: "I was nervous but the team made it so easy. My teeth are several shades brighter and I had zero sensitivity.",
    rating: 5,
  },
  {
    name: "Rahul M.",
    treatment: "Dental Implant",
    quote: "Booked on WhatsApp in two minutes and got a reminder the day before. The implant feels exactly like my own tooth.",
    rating: 5,
  },
  {
    name: "Sneha & Aarav",
    treatment: "Kids' Dentistry",
    quote: "My 5-year-old actually asks to go back to the dentist! Dr. Meera is wonderful with children.",
    rating: 5,
  },
  {
    name: "Mohammed A.",
    treatment: "Root Canal",
    quote: "Walked in with terrible pain and walked out comfortable the same day. Clear pricing, no surprises.",
    rating: 5,
  },
];

export const whyUs = [
  { title: "Painless by design", body: "Modern anaesthesia, rotary tools and a gentle chair-side manner." },
  { title: "Transparent pricing", body: "You get a written estimate before any treatment. No hidden costs." },
  { title: "Easy EMI plans", body: "Spread the cost of implants, braces and makeovers over comfortable instalments." },
  { title: "Sterile & safe", body: "Hospital-grade sterilisation with single-use instruments wherever possible." },
  { title: "Book in 2 minutes", body: "Book online or on WhatsApp and get automatic reminders." },
  { title: "Evening & Saturday slots", body: "Open until 7 pm on weekdays and on Saturdays." },
] as const;

export const faqs = [
  {
    q: "Is dental treatment painful?",
    a: "We use modern anaesthesia and gentle techniques, so most patients feel little to no pain. If you're anxious, tell us and we'll go at your pace.",
  },
  {
    q: "How do I book an appointment?",
    a: "Use the online booking form, or message us on WhatsApp. You'll get a confirmation message on WhatsApp and a reminder the day before your visit.",
  },
  {
    q: "Do you offer EMI or payment plans?",
    a: "Yes. Implants, braces and smile makeovers can be spread over easy monthly instalments. Ask at your consultation.",
  },
  {
    q: "What if I have a dental emergency?",
    a: "Message us on WhatsApp or call. We keep slots free every day for emergencies like severe pain, swelling or broken teeth.",
  },
  {
    q: "How often should I get a check-up?",
    a: "Every six months for most people. Kids and anyone with gum disease or braces may need to come more often.",
  },
  {
    q: "Is teeth whitening safe?",
    a: "Yes, when supervised by a dentist. We check your teeth first and protect your gums during treatment.",
  },
] as const;

export interface GalleryItem {
  title: string;
  caption: string;
  /** Add real photos to /public/gallery and set these paths, e.g. "/gallery/whitening-before.jpg" */
  before?: string;
  after?: string;
}

// SAMPLE: shown as placeholders until before/after photos (with patient consent) are added
export const gallery: GalleryItem[] = [
  { title: "Whitening", caption: "One 60-minute session" },
  { title: "Aligners", caption: "10 months of treatment" },
  { title: "Smile makeover", caption: "Veneers & bonding" },
];

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  body: string[];
}

export const posts: Post[] = [
  {
    slug: "how-often-should-you-visit-the-dentist",
    title: "How often should you really visit the dentist?",
    excerpt: "Six months is the rule of thumb, but your ideal schedule depends on your mouth.",
    date: "2026-09-12",
    readMinutes: 3,
    body: [
      "Most adults do well with a check-up and cleaning every six months. That interval is long enough to avoid over-treatment and short enough to catch cavities and early gum disease.",
      "You may need more frequent visits if you wear braces, smoke, have diabetes, a history of gum disease, or a tendency to build up tartar quickly.",
      "Children should have their first visit around their first birthday, then follow the same six-month rhythm. Early visits build comfort and spot habits like thumb-sucking before they affect alignment.",
      "Not sure where you fit? Book a check-up and we'll recommend a schedule that suits you.",
    ],
  },
  {
    slug: "braces-vs-clear-aligners",
    title: "Braces vs clear aligners: which is right for you?",
    excerpt: "Both straighten teeth. Here's how to choose between them.",
    date: "2026-08-03",
    readMinutes: 4,
    body: [
      "Traditional braces are the most versatile option and can correct almost any alignment problem, including complex bite issues. They're fixed, so there's no way to forget to wear them.",
      "Clear aligners are nearly invisible and removable, which makes eating and brushing simple. They suit mild to moderate crowding or spacing and need to be worn about 22 hours a day.",
      "Cost depends on case complexity rather than just the type. A free consultation with a smile simulation shows what each option would achieve for you.",
    ],
  },
  {
    slug: "what-to-do-in-a-dental-emergency",
    title: "What to do in a dental emergency",
    excerpt: "Knocked-out tooth? Severe pain? Here's what to do before you reach us.",
    date: "2026-06-20",
    readMinutes: 3,
    body: [
      "For a knocked-out adult tooth, hold it by the crown (not the root), rinse gently with milk or water, and try to place it back in the socket. If you can't, keep it in milk and see a dentist within 30 minutes.",
      "For severe toothache, rinse with warm salt water, use floss to remove trapped food, and take a standard painkiller. Avoid putting aspirin directly on the gum.",
      "For facial swelling or fever with a toothache, see a dentist the same day. Message us on WhatsApp and we'll find you a slot.",
    ],
  },
];
