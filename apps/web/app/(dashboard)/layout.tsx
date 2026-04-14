'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { readSession } from '../../lib/auth';
import TopHeader from '../../components/TopHeader';
// BottomNav removed — navigation moved to top

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();

  useEffect(() => {
    if (!readSession()) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopHeader />
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
