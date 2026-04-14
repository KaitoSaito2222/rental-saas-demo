'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/api';

const provinces = ['BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'NT', 'NU', 'YT'];

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

      setMessage(`Property "${(property as { name?: string }).name ?? ''}" created successfully.`);
      event.currentTarget.reset();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/dashboard/properties" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-primary transition-colors mb-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Properties
      </Link>

      <h1 className="text-2xl font-bold text-primary mb-6">Add Property</h1>

      <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Property name</label>
          <input
            name="name"
            placeholder="e.g. Granville Townhome"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Address</label>
          <input
            name="address"
            placeholder="e.g. 123 Main St, Vancouver"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Province</label>
          <select
            name="province"
            defaultValue="BC"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
          >
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
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
          {loading ? 'Saving...' : 'Create Property'}
        </button>
      </form>
    </div>
  );
}
