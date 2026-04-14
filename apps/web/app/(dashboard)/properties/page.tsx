'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';

interface Property {
  id: string;
  name: string;
  address: string;
  province: string;
  createdAt: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Property[]>('/properties')
      .then(setProperties)
      .catch(() => setError('Failed to load properties'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Properties</h1>
        <Link
          href="/dashboard/properties/new"
          className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          + Add
        </Link>
      </div>

      {loading && (
        <p className="text-sm text-[var(--muted)]">Loading...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && properties.length === 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center mb-4 mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="10" width="18" height="11" rx="1" />
              <path d="M9 21V10M15 21V10" />
              <path d="M5 10V7a7 7 0 0 1 14 0v3" />
            </svg>
          </div>
          <p className="text-sm font-medium text-primary mb-1">No properties yet</p>
          <p className="text-xs text-[var(--muted)] mb-4">Add your first property to start accepting applications.</p>
          <Link
            href="/dashboard/properties/new"
            className="inline-block bg-primary text-white text-sm font-medium px-5 py-2 rounded-full"
          >
            Add Property
          </Link>
        </div>
      )}

      {!loading && properties.length > 0 && (
        <div className="flex flex-col gap-3">
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/properties/${p.id}`}
              className="rounded-2xl border border-[var(--border)] bg-white p-4 flex items-center gap-4 hover:bg-[var(--surface)] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="10" width="18" height="11" rx="1" />
                  <path d="M9 21V10M15 21V10" />
                  <path d="M5 10V7a7 7 0 0 1 14 0v3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary truncate">{p.name}</p>
                <p className="text-xs text-[var(--muted)] truncate">{p.address}, {p.province}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
