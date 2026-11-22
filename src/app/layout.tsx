import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { JsonLd } from "@/components/JsonLd";
import { clinic } from "@/lib/clinic";
import { dentistSchema } from "@/lib/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${clinic.name} | Painless dentistry in ${clinic.address.city}`, template: `%s | ${clinic.name}` },
  description: `${clinic.tagline}. Implants, braces, whitening, root canals and kids' dentistry in ${clinic.address.city}. Book online or on WhatsApp in 2 minutes.`,
  openGraph: { type: "website", siteName: clinic.name, locale: "en_IN" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#0f766e", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <JsonLd data={dentistSchema()} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
