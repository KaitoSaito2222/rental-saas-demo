'use client';

import { useEffect, useState } from 'react';
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
      .catch((fetchError) => setError(fetchError instanceof Error ? fetchError.message : 'Failed to load property'));
  }, [params.id]);

  return (
    <section className="space-y-6">
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <article className="rounded-3xl border border-[var(--panel-border)] bg-white/80 p-8 shadow-soft backdrop-blur">
        <h2 className="text-2xl font-semibold text-ink">{property?.name ?? 'Loading property...'}</h2>
        <p className="mt-2 text-slate-600">{property?.address}</p>
        <p className="mt-2 text-sm text-slate-500">Province: {property?.province}</p>
      </article>
      <article className="rounded-3xl border border-[var(--panel-border)] bg-white/80 p-8 shadow-soft backdrop-blur">
        <h3 className="text-lg font-semibold text-ink">Applications</h3>
        <div className="mt-4 space-y-3">
          {applications.map((application) => (
            <div key={application.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium text-ink">{application.applicantEmail}</p>
              <p className="text-slate-500">Income: {application.income}</p>
              <p className="text-slate-500">Status: {application.status}</p>
            </div>
          ))}
          {!applications.length ? <p className="text-sm text-slate-500">No applications yet.</p> : null}
        </div>
      </article>
    </section>
  );
}
