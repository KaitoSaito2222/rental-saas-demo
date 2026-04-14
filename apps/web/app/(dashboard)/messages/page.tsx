export default function MessagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Messages</h1>

      <div className="rounded-2xl border border-[var(--border)] bg-white p-6 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-lg font-semibold text-primary">Tenant Messaging</h2>
          <span className="inline-block bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Chat directly with landlords and tenants in one secure place.
          Never lose track of conversations with searchable message history.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-lg font-semibold text-primary">Automated Notifications</h2>
          <span className="inline-block bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Get notified instantly when applications are submitted, reviewed, or when rent is due.
          Customize your notification preferences per property.
        </p>
      </div>
    </div>
  );
}
