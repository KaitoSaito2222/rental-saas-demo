'use client';

import { useEffect, useState } from 'react';
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
      .catch((fetchError) => setError(fetchError instanceof Error ? fetchError.message : 'Failed to load dashboard'));
  }, []);

  return (
    <section className="grid gap-6 md:grid-cols-3">
      <StatCard label="Properties" value={stats?.properties ?? '--'} />
      <StatCard label="Applications" value={stats?.applications ?? '--'} />
      <StatCard label="Pending" value={stats?.pendingApplications ?? '--'} />
      {error ? <p className="md:col-span-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="rounded-3xl border border-[var(--panel-border)] bg-white/80 p-6 shadow-soft backdrop-blur">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-ink">{value}</p>
    </article>
  );
}
