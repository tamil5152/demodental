import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "Dental Tips & Advice",
  description: "Practical dental health advice from our dentists.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <section className="section bg-surface">
      <div className="container-x">
        <p className="eyebrow">Dental tips</p>
        <h1 className="h2">Advice from our dentists</h1>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="card block h-full transition-shadow hover:shadow-md">
                <time dateTime={p.date} className="text-xs text-muted">{new Date(p.date).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "UTC" })} · {p.readMinutes} min read</time>
                <h2 className="mt-2 text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
