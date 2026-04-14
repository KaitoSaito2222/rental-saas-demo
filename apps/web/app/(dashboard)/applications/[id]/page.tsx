'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/api';

type Application = {
  id: string;
  applicantEmail: string;
  income: number;
  status: string;
  notes?: string | null;
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  REVIEWED: 'bg-blue-50 text-blue-700 border-blue-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Application>(`/applications/${params.id}`)
      .then(setApplication)
      .catch((fetchError) =>
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load application'),
      );
  }, [params.id]);

  async function updateStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const updated = await apiFetch<Application>(`/applications/${params.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: String(formData.get('status') ?? 'PENDING') }),
      });

      setApplication(updated);
      setMessage('Status updated successfully.');
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update status');
    }
  }

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
        <h2 className="text-lg font-bold text-primary mb-4">Application Details</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
            <span className="text-sm text-[var(--muted)]">Applicant</span>
            <span className="text-sm font-medium text-primary">{application?.applicantEmail ?? '...'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
            <span className="text-sm text-[var(--muted)]">Annual Income</span>
            <span className="text-sm font-medium text-primary">${application?.income?.toLocaleString() ?? '...'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
            <span className="text-sm text-[var(--muted)]">Status</span>
            {application?.status ? (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[application.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
              </span>
            ) : (
              <span className="text-sm text-[var(--muted)]">...</span>
            )}
          </div>
          {application?.notes && (
            <div className="py-2">
              <span className="text-sm text-[var(--muted)]">Notes</span>
              <p className="text-sm text-primary mt-1">{application.notes}</p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={updateStatus} className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-4">
        <h3 className="text-base font-semibold text-primary">Update Status</h3>
        <select
          name="status"
          defaultValue={application?.status ?? 'PENDING'}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
        >
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        {message && (
          <p className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">{message}</p>
        )}
        <button className="w-full bg-primary text-white text-sm font-semibold py-3 rounded-full hover:opacity-90 transition-opacity">
          Save Status
        </button>
      </form>
    </div>
  );
}
