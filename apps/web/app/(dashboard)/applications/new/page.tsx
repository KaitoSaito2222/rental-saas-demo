'use client';

import { FormEvent, useState } from 'react';
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

      setMessage(`Created application ${(application as { id?: string }).id ?? ''}`);
      event.currentTarget.reset();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create application');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl rounded-3xl border border-[var(--panel-border)] bg-white/80 p-8 shadow-soft backdrop-blur">
      <h2 className="text-2xl font-semibold text-ink">Submit application</h2>
      <div className="mt-6 space-y-4">
        <input name="propertyId" placeholder="property id" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
        <input name="applicantEmail" type="email" placeholder="applicant email" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
        <input name="income" type="number" placeholder="income" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
        <textarea name="notes" placeholder="notes" className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        <button disabled={loading} className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-sand disabled:opacity-60">
          {loading ? 'Submitting...' : 'Submit application'}
        </button>
      </div>
    </form>
  );
}
