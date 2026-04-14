'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/api';
import { getCurrentUser } from '../../../../lib/jwt';

type Application = {
  id: string;
  applicantEmail: string;
  income: number;
  status: string;
  notes?: string | null;
  property?: {
    id: string;
    name: string;
    address: string;
  } | null;
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  REVIEWED: 'bg-blue-50 text-blue-700 border-blue-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

const statusOptions = ['ALL', 'PENDING', 'REVIEWED', 'APPROVED', 'REJECTED'] as const;

export default function ApplicationsPage() {
  const currentUser = getCurrentUser();
  const canReviewApplications =
    currentUser?.role !== undefined && ['LANDLORD', 'PM', 'ADMIN'].includes(currentUser.role);
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Application[]>('/applications')
      .then(setApplications)
      .catch((fetchError) =>
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load applications'),
      );
  }, []);

  const query = search.trim().toLowerCase();
  const filteredApplications = applications.filter((application) => {
    const matchesStatus = statusFilter === 'ALL' || application.status === statusFilter;
    const haystack = [
      application.applicantEmail,
      application.property?.name ?? '',
      application.property?.address ?? '',
      application.notes ?? '',
      application.id,
    ]
      .join(' ')
      .toLowerCase();

    return matchesStatus && (!query || haystack.includes(query));
  });

  const pendingCount = applications.filter((application) => application.status === 'PENDING').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">Applications</h1>
        <p className="text-sm text-[var(--muted)]">
          {canReviewApplications
            ? 'Review, search, and filter every application in one place.'
            : 'Track your submitted applications in one place.'}
        </p>
      </div>

      {error && (
        <p className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-white p-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <label className="block">
            <span className="sr-only">Search applications</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by email, property, notes, or ID"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
            />
          </label>
          <div className="text-sm text-[var(--muted)]">
            {canReviewApplications
              ? `${pendingCount} pending review${pendingCount === 1 ? '' : 's'}`
              : `${pendingCount} pending application${pendingCount === 1 ? '' : 's'}`}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => {
            const active = statusFilter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setStatusFilter(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                  active
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-[var(--muted)] border-[var(--border)] hover:bg-[var(--surface)]'
                }`}
              >
                {option === 'ALL' ? 'All' : option.charAt(0) + option.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {filteredApplications.map((application) => (
          <Link
            key={application.id}
            href={`/dashboard/applications/${application.id}`}
            className="rounded-2xl border border-[var(--border)] bg-white p-4 flex items-start gap-4 hover:bg-[var(--surface)] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary truncate">{application.applicantEmail}</p>
                  <p className="text-xs text-[var(--muted)] truncate">
                    {application.property?.name ?? 'Unknown property'}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    Income: ${application.income.toLocaleString()}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[application.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
                </span>
              </div>
              {application.notes && (
                <p className="text-sm text-[var(--muted)] mt-3 line-clamp-2">{application.notes}</p>
              )}
            </div>
          </Link>
        ))}

        {filteredApplications.length === 0 && (
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--muted)]">
            No applications match your search.
          </div>
        )}
      </div>
    </div>
  );
}