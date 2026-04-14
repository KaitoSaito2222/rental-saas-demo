'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/api';

type Property = {
  id: string;
  name: string;
  address: string;
  province: string;
};

type Application = {
  id: string;
  applicantEmail: string;
  income: number;
  status: string;
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  REVIEWED: 'bg-blue-50 text-blue-700 border-blue-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch<Property>(`/properties/${params.id}`),
      apiFetch<Application[]>(`/properties/${params.id}/applications`),
    ])
      .then(([propertyResponse, applicationResponse]) => {
        setProperty(propertyResponse);
        setApplications(applicationResponse);
      })
      .catch((fetchError) =>
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load property'),
      );
  }, [params.id]);

  return (
    <div className="space-y-5">
      <Link href="/dashboard/properties" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-primary transition-colors mb-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Properties
      </Link>

      {error && (
        <p className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="10" width="18" height="11" rx="1" />
              <path d="M9 21V10M15 21V10" />
              <path d="M5 10V7a7 7 0 0 1 14 0v3" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">{property?.name ?? 'Loading...'}</h2>
            <p className="text-sm text-[var(--muted)]">{property?.address}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{property?.province}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-primary">Applications</h3>
          <span className="text-xs text-[var(--muted)]">{applications.length} total</span>
        </div>
        <div className="space-y-2">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/dashboard/applications/${app.id}`}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3 hover:bg-[var(--surface)] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{app.applicantEmail}</p>
                <p className="text-xs text-[var(--muted)]">Income: ${app.income.toLocaleString()}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[app.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
              </span>
            </Link>
          ))}
          {applications.length === 0 && (
            <p className="text-sm text-[var(--muted)] py-2">No applications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
