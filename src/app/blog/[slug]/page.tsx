import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { clinic, posts } from "@/lib/clinic";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", publishedTime: p.date },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <article className="section">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          datePublished: p.date,
          description: p.excerpt,
          author: { "@type": "Organization", name: clinic.name },
        }}
      />
      <div className="container-x max-w-3xl">
        <Link href="/blog" className="text-sm text-brand-700 hover:underline">← All tips</Link>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight">{p.title}</h1>
        <time dateTime={p.date} className="mt-2 block text-sm text-muted">
          {new Date(p.date).toLocaleDateString("en-IN", { dateStyle: "long", timeZone: "UTC" })} · {p.readMinutes} min read
        </time>
        <div className="mt-8 space-y-5 text-lg leading-relaxed">
          {p.body.map((para) => <p key={para.slice(0, 40)}>{para}</p>)}
        </div>
        <div className="mt-12 rounded-2xl bg-brand-50 p-6">
          <p className="font-semibold">Questions about your teeth?</p>
          <Link href="/book" className="btn-primary mt-4"><CalendarCheck aria-hidden className="size-5" /> Book a check-up</Link>
        </div>
      </div>
    </article>
  );
}
