import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <section className="grid gap-8 rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] p-8 shadow-soft backdrop-blur md:grid-cols-[1.3fr,0.7fr] md:p-12">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
            Property Copilot Demo
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            A compact rental workflow demo for landlords and tenants.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Register an organization, create a property, submit an application, and update its screening status.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-sand" href="/register">
              Start registration
            </Link>
            <Link className="rounded-full border border-slate-300 bg-white/70 px-5 py-3 text-sm font-semibold text-ink" href="/login">
              Sign in
            </Link>
            <Link className="rounded-full border border-slate-300 bg-white/70 px-5 py-3 text-sm font-semibold text-ink" href="/dashboard">
              Open dashboard
            </Link>
          </div>
        </div>
        <aside className="rounded-2xl border border-slate-200 bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">MVP scope</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>Landlord and tenant authentication</li>
            <li>Property creation</li>
            <li>Tenant application submission</li>
            <li>Pending, Reviewed, Approved, Rejected statuses</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
