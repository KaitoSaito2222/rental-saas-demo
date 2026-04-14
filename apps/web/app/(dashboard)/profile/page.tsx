'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import { clearSession } from '../../../lib/auth';

interface User {
  id: string;
  email: string;
  role: string;
  organization: { name: string; plan: string };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    apiFetch<User>('/auth/me').then(setUser).catch(() => null);
  }, []);

  function handleSignOut() {
    clearSession();
    router.push('/login');
  }

  const planLabel = user?.organization?.plan ?? 'Free';

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Profile</h1>

      {/* Avatar + info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <button
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
            aria-label="Change photo"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
        </div>
        <div>
          <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-1">
            {planLabel.charAt(0).toUpperCase() + planLabel.slice(1).toLowerCase()}
          </span>
          <p className="text-sm text-[var(--muted)]">{user?.email ?? '...'}</p>
        </div>
      </div>

      {/* Account section */}
      <section className="mb-4">
        <h2 className="text-base font-semibold text-primary mb-2 px-1">Account</h2>
        <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-[var(--surface)] transition-colors border-b border-[var(--border)]"
          >
            <span className="w-9 h-9 rounded-xl bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span className="flex-1 text-left text-sm font-medium text-primary">Sign Out</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-[var(--surface)] transition-colors">
            <span className="w-9 h-9 rounded-xl bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </span>
            <span className="flex-1 text-left text-sm font-medium text-red-500">Delete Account</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

      {/* Help & Feedback section */}
      <section>
        <h2 className="text-base font-semibold text-primary mb-2 px-1">Help &amp; Feedback</h2>
        <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
          <button className="w-full flex items-center gap-3 px-4 py-4 border-b border-[var(--border)] opacity-40 cursor-not-allowed">
            <span className="w-9 h-9 rounded-xl bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </span>
            <span className="flex-1 text-left text-sm font-medium text-primary">Chat Support</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-[var(--surface)] transition-colors border-b border-[var(--border)]">
            <span className="w-9 h-9 rounded-xl bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
              </svg>
            </span>
            <span className="flex-1 text-left text-sm font-medium text-primary">FAQs</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-[var(--surface)] transition-colors">
            <span className="w-9 h-9 rounded-xl bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.14h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <span className="flex-1 text-left text-sm font-medium text-primary">Contact us</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
