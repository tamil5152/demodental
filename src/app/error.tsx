"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section">
      <div className="container-x text-center">
        <h1 className="h2">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">Please try again. If it keeps happening, message us on WhatsApp.</p>
        <button onClick={reset} className="btn-primary mt-8">Try again</button>
      </div>
    </section>
  );
}
