export default function MessagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Messages</h1>

      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-primary mb-1">Messaging</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Chat directly with landlords and tenants in one secure place.
        </p>
        <span className="inline-block bg-[var(--surface)] text-[var(--muted)] text-xs font-medium px-3 py-1 rounded-full border border-[var(--border)]">
          Coming soon
        </span>
      </div>
    </div>
  );
}
