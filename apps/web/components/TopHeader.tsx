'use client';

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

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[var(--border)]">
      <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
        {/* Left: placeholder / site identity */}
        <div className="w-24" />

        {/* Center: nav tabs */}
        <nav className="flex items-center gap-1">
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

        {/* Right: sign out */}
        <div className="flex justify-end w-24">
          <button
            onClick={() => { clearSession(); router.push('/login'); }}
            className="text-sm text-[var(--muted)] hover:text-primary transition-colors"
            type="button"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
