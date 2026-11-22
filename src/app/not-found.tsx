import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-x text-center">
        <p className="eyebrow">404</p>
        <h1 className="h2">We couldn&apos;t find that page</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">It may have moved. Let&apos;s get you back on track.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">Home</Link>
          <Link href="/book" className="btn-ghost">Book appointment</Link>
        </div>
      </div>
    </section>
  );
}
