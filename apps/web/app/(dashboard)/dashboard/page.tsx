'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';

type Stats = {
  properties: number;
  applications: number;
  pendingApplications: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Stats>('/dashboard/stats')
      .then(setStats)
      .catch((fetchError) =>
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load dashboard'),
      );
  }, []);

  const isSetupComplete = stats && stats.properties > 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">What&apos;s Next</h1>

      {!isSetupComplete && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              <path d="M16 3.5a4 4 0 0 1 0 5" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-primary mb-1">Complete Account Setup</h2>
          <p className="text-sm text-[var(--muted)] mb-5">
            Finish setting up your account to apply instantly and access verified listings.
          </p>
          <Link
            href="/dashboard/properties/new"
            className="inline-block bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Begin Setup
          </Link>
        </div>
      )}

      {error && (
        <p className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 mb-6">
          {error}
        </p>
      )}

      {stats && (
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          <StatCard label="Properties" value={stats.properties} />
          <StatCard label="Applications" value={stats.applications} />
          <StatCard label="Pending" value={stats.pendingApplications} />
        </div>
      )}

      {stats && stats.properties > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/dashboard/properties"
            className="rounded-2xl border border-[var(--border)] bg-white p-4 flex items-center gap-4 hover:bg-[var(--surface)] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="10" width="18" height="11" rx="1" />
                <path d="M9 21V10M15 21V10" />
                <path d="M5 10V7a7 7 0 0 1 14 0v3" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">View Properties</p>
              <p className="text-xs text-[var(--muted)]">{stats.properties} active {stats.properties === 1 ? 'listing' : 'listings'}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          {stats.pendingApplications > 0 && (
            <Link
              href="/dashboard/properties"
              className="rounded-2xl border border-[var(--border)] bg-white p-4 flex items-center gap-4 hover:bg-[var(--surface)] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">Review Applications</p>
                <p className="text-xs text-[var(--muted)]">{stats.pendingApplications} pending {stats.pendingApplications === 1 ? 'review' : 'reviews'}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-white p-4 text-center">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-[var(--muted)] mt-1">{label}</p>
    </article>
  );
}
