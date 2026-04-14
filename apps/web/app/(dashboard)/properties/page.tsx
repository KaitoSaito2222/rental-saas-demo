'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, deleteProperty } from '../../../lib/api';
import { getCurrentUser } from '../../../lib/jwt';

interface Property {
  id: string;
  name: string;
  address: string;
  province: string;
  createdAt: string;
  organization?: {
    name: string;
    slug: string;
  };
}

export default function PropertiesPage() {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const canManageProperties = currentUser?.role && ['LANDLORD', 'PM', 'ADMIN'].includes(currentUser.role);
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Property[]>('/properties')
      .then(setProperties)
      .catch(() => setError('Failed to load properties'))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setShowConfirm(null);
    } catch {
      setError('Failed to delete property');
    } finally {
      setDeletingId(null);
    }
  }

  const query = search.trim().toLowerCase();
  const filteredProperties = properties.filter((property) => {
    if (!query) {
      return true;
    }

    const haystack = [
      property.name,
      property.address,
      property.province,
      property.organization?.name ?? '',
      property.organization?.slug ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Properties</h1>
        {canManageProperties && (
          <Link
            href="/dashboard/properties/new"
            className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            + Add
          </Link>
        )}
      </div>

      {!loading && properties.length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-4 mb-5">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by property, address, province, or landlord"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
            />
            <p className="text-sm text-[var(--muted)]">
              {filteredProperties.length} result{filteredProperties.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      )}

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
          {canManageProperties ? (
            <>
              <p className="text-xs text-[var(--muted)] mb-4">Add your first property to start accepting applications.</p>
              <Link
                href="/dashboard/properties/new"
                className="inline-block bg-primary text-white text-sm font-medium px-5 py-2 rounded-full"
              >
                Add Property
              </Link>
            </>
          ) : (
            <p className="text-xs text-[var(--muted)]">Browse available properties and submit your applications.</p>
          )}
        </div>
      )}

      {!loading && properties.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((p) => (
            <article key={p.id} className="rounded-2xl border border-[var(--border)] bg-white p-4 flex flex-col gap-4">
              <Link href={`/dashboard/properties/${p.id}`} className="group block">
                <div className="w-11 h-11 rounded-xl bg-[var(--surface)] flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="10" width="18" height="11" rx="1" />
                    <path d="M9 21V10M15 21V10" />
                    <path d="M5 10V7a7 7 0 0 1 14 0v3" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-primary truncate group-hover:opacity-80 transition-opacity">{p.name}</p>
                <p className="text-sm text-[var(--muted)] mt-1 line-clamp-2">{p.address}</p>
                <p className="text-xs text-[var(--muted)] mt-2">{p.province}</p>
                {p.organization?.name && (
                  <p className="text-xs text-[var(--muted)] mt-1">Listed by {p.organization.name}</p>
                )}
              </Link>

              <div className="mt-auto flex items-center gap-2">
                <button
                  onClick={() => router.push(`/dashboard/properties/${p.id}`)}
                  className="flex-1 text-xs font-medium px-3 py-2 rounded-full border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)] transition-colors"
                >
                  View
                </button>
                {canManageProperties && (
                  <>
                    <button
                      onClick={() => router.push(`/dashboard/properties/${p.id}/edit`)}
                      className="flex-1 text-xs font-medium px-3 py-2 rounded-full border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowConfirm(p.id)}
                      className="flex-1 text-xs font-medium px-3 py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && properties.length > 0 && filteredProperties.length === 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--muted)]">
          No properties match your search.
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-base font-semibold text-primary mb-2">Delete Property?</h3>
            <p className="text-sm text-[var(--muted)] mb-5">
              This will permanently delete the property and all its applications.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 rounded-full border border-[var(--border)] py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface)]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showConfirm)}
                disabled={!!deletingId}
                className="flex-1 rounded-full bg-red-500 text-white py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {deletingId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
