'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/api';

export default function NewApplicationPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData(event.currentTarget);

    try {
      const application = await apiFetch('/applications', {
        method: 'POST',
        body: JSON.stringify({
          propertyId: String(formData.get('propertyId') ?? ''),
          applicantEmail: String(formData.get('applicantEmail') ?? ''),
          income: Number(formData.get('income') ?? 0),
          notes: String(formData.get('notes') ?? ''),
        }),
      });

      setMessage(`Application submitted (ID: ${(application as { id?: string }).id ?? ''})`);
      event.currentTarget.reset();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create application');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-primary transition-colors mb-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Home
      </Link>

      <h1 className="text-2xl font-bold text-primary mb-6">Submit Application</h1>

      <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Property ID</label>
          <input
            name="propertyId"
            placeholder="Enter property ID"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Applicant email</label>
          <input
            name="applicantEmail"
            type="email"
            placeholder="applicant@email.com"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Annual income ($)</label>
          <input
            name="income"
            type="number"
            placeholder="e.g. 60000"
            min="0"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Notes <span className="text-[var(--muted)] font-normal">(optional)</span></label>
          <textarea
            name="notes"
            placeholder="Any additional information..."
            className="min-h-28 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</p>
        )}
        {message && (
          <p className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">{message}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-primary text-white text-sm font-semibold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
