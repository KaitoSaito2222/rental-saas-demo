'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, readSession } from '../../lib/auth';

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();

  useEffect(() => {
    if (!readSession()) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <header className="mx-auto mb-6 flex max-w-6xl items-center justify-between rounded-3xl border border-[var(--panel-border)] bg-white/80 px-5 py-4 shadow-soft backdrop-blur">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Property Copilot</p>
          <h1 className="text-lg font-semibold text-ink">Dashboard</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/properties/new">New property</Link>
          <Link href="/dashboard/applications/new">New application</Link>
          <button
            className="rounded-full border border-slate-300 bg-white px-4 py-2"
            onClick={() => {
              clearSession();
              router.push('/login');
            }}
            type="button"
          >
            Sign out
          </button>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl">{children}</main>
    </div>
  );
}
