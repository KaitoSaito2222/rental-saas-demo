export default function PaymentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Payment</h1>

      <div className="rounded-2xl border border-[var(--border)] bg-white p-6 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-primary mb-1">Payment History</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Track rent payments, receipts, and payment status in one place.
        </p>
        <span className="inline-block bg-[var(--surface)] text-[var(--muted)] text-xs font-medium px-3 py-1 rounded-full border border-[var(--border)]">
          Coming soon
        </span>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-primary mb-1">Rent Reporting</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Build your credit score by reporting on-time rent payments to Equifax.
        </p>
        <span className="inline-block bg-[var(--surface)] text-[var(--muted)] text-xs font-medium px-3 py-1 rounded-full border border-[var(--border)]">
          Coming soon
        </span>
      </div>
    </div>
  );
}
