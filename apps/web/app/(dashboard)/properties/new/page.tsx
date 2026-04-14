'use client';

import { FormEvent, useState } from 'react';
import { apiFetch } from '../../../../lib/api';

export default function NewPropertyPage() {
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
      const property = await apiFetch('/properties', {
        method: 'POST',
        body: JSON.stringify({
          name: String(formData.get('name') ?? ''),
          address: String(formData.get('address') ?? ''),
          province: String(formData.get('province') ?? 'BC'),
        }),
      });

      setMessage(`Created property ${(property as { name?: string }).name ?? ''}`);
      event.currentTarget.reset();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl rounded-3xl border border-[var(--panel-border)] bg-white/80 p-8 shadow-soft backdrop-blur">
      <h2 className="text-2xl font-semibold text-ink">Create property</h2>
      <div className="mt-6 space-y-4">
        <input name="name" placeholder="property name" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
        <input name="address" placeholder="address" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
        <input name="province" defaultValue="BC" placeholder="province" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        <button disabled={loading} className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-sand disabled:opacity-60">
          {loading ? 'Saving...' : 'Create property'}
        </button>
      </div>
    </form>
  );
}
