'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, updateProperty } from '../../../../../lib/api';
import { getCurrentUser } from '../../../../../lib/jwt';

const provinces = ['BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'NT', 'NU', 'YT'];

type Property = {
  id: string;
  name: string;
  address: string;
  province: string;
};

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('BC');
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // Redirect if not authorized to edit properties
    if (currentUser && !['LANDLORD', 'PM', 'ADMIN'].includes(currentUser.role)) {
      router.replace(`/dashboard/properties/${params.id}`);
    }
  }, [currentUser, params.id, router]);

  // Show nothing while checking authorization
  if (!currentUser || !['LANDLORD', 'PM', 'ADMIN'].includes(currentUser.role)) {
    return null;
  }

  useEffect(() => {
    apiFetch<Property>(`/properties/${params.id}`)
      .then((p) => {
        setName(p.name);
        setAddress(p.address);
        setProvince(p.province);
      })
      .catch(() => setLoadError('Failed to load property'))
      .finally(() => setFetching(false));
  }, [params.id]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateProperty(params.id, { name, address, province });
      router.push(`/dashboard/properties/${params.id}`);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update property');
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href={`/dashboard/properties/${params.id}`} className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-primary transition-colors mb-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>

      <h1 className="text-2xl font-bold text-primary mb-6">Edit Property</h1>

      {loadError && (
        <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 mb-4">{loadError}</p>
      )}

      <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Property name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Granville Townhome"
            disabled={fetching}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 disabled:opacity-50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Main St, Vancouver"
            disabled={fetching}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 disabled:opacity-50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Province</label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            disabled={fetching}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 disabled:opacity-50"
          >
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <button
          disabled={loading || fetching}
          className="w-full bg-primary text-white text-sm font-semibold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
