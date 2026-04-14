import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-end border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm font-medium text-[var(--muted)] px-4 py-2 hover:text-primary transition-colors">
            Sign in
          </Link>
          <Link href="/register" className="text-sm font-semibold text-white bg-primary px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-2xl mx-auto">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--muted)] border border-[var(--border)] rounded-full px-4 py-1.5 mb-6">
          Demo
        </span>
        <h1 className="text-4xl font-bold text-primary leading-tight mb-4 md:text-5xl">
          Your entire rental process,<br />in one place.
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed mb-8 max-w-lg">
          Register an organization, list properties, screen applicants, and manage everything from a single dashboard.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/register" className="bg-primary text-white text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
            Start for free
          </Link>
          <Link href="/login" className="border border-[var(--border)] text-primary text-sm font-semibold px-6 py-3 rounded-full hover:bg-[var(--surface)] transition-colors">
            Sign in
          </Link>
          <Link href="/dashboard" className="border border-[var(--border)] text-[var(--muted)] text-sm font-medium px-6 py-3 rounded-full hover:bg-[var(--surface)] transition-colors">
            Open dashboard
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 pb-20 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'List properties', desc: 'Add and manage rental listings' },
            { label: 'Screen tenants', desc: 'Review applications with status tracking' },
            { label: 'Track applications', desc: 'Pending → Reviewed → Approved' },
            { label: 'Multi-tenant', desc: 'Isolated data per organization' },
          ].map((f) => (
            <div key={f.label} className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <p className="text-sm font-semibold text-primary mb-1">{f.label}</p>
              <p className="text-xs text-[var(--muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
