'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../../../../lib/api';

type Application = {
  id: string;
  applicantEmail: string;
  income: number;
  status: string;
  notes?: string | null;
};

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Application>(`/applications/${params.id}`)
      .then(setApplication)
      .catch((fetchError) => setError(fetchError instanceof Error ? fetchError.message : 'Failed to load application'));
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
      setMessage('Status updated');
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update status');
    }
  }

  return (
    <section className="space-y-6">
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <article className="rounded-3xl border border-[var(--panel-border)] bg-white/80 p-8 shadow-soft backdrop-blur">
        <h2 className="text-2xl font-semibold text-ink">Application {application?.id ?? 'loading...'}</h2>
        <p className="mt-2 text-slate-600">Applicant: {application?.applicantEmail}</p>
        <p className="mt-2 text-slate-600">Income: {application?.income}</p>
        <p className="mt-2 text-slate-600">Status: {application?.status}</p>
        <p className="mt-2 text-slate-600">Notes: {application?.notes ?? 'None'}</p>
      </article>
      <form onSubmit={updateStatus} className="max-w-md rounded-3xl border border-[var(--panel-border)] bg-white/80 p-8 shadow-soft backdrop-blur">
        <h3 className="text-lg font-semibold text-ink">Update status</h3>
        <select name="status" defaultValue={application?.status ?? 'PENDING'} className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        {message ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        <button className="mt-4 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-sand">Save</button>
      </form>
    </section>
  );
}
