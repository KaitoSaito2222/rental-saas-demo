'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { clearSession } from '../lib/auth';

const tabs = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Property', href: '/dashboard/properties' },
  { label: 'Payment', href: '/dashboard/payment' },
  { label: 'Messages', href: '/dashboard/messages' },
  { label: 'Profile', href: '/dashboard/profile' },
];

export default function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  function handleSignOut() {
    clearSession();
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[var(--border)]">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-sm font-semibold text-primary">
          Rental Demo
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive =
              tab.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-[var(--muted)] hover:text-primary hover:bg-[var(--surface)]'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex justify-end">
          <button
            onClick={handleSignOut}
            className="text-sm text-[var(--muted)] hover:text-primary transition-colors"
            type="button"
          >
            Sign out
          </button>
        </div>

        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-primary hover:bg-[var(--surface)] transition-colors"
        >
          {mobileMenuOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {tabs.map((tab) => {
              const isActive =
                tab.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-[var(--muted)] hover:text-primary hover:bg-[var(--surface)]'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              type="button"
              className="mt-2 w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
