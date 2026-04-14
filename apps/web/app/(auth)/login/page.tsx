'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
import { saveSession } from '../../../lib/auth';

type LoginResponse = {
  accessToken: string;
  expiresAt: string;
  user: { id: string; email: string; role: string; organizationId: string };
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);

    try {
      const response = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          organizationSlug: String(formData.get('organizationSlug') ?? ''),
          email: String(formData.get('email') ?? ''),
          password: String(formData.get('password') ?? ''),
        }),
      });

      saveSession(response.accessToken);
      router.push('/dashboard');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-primary text-center mb-1">Welcome back</h1>
        <p className="text-sm text-[var(--muted)] text-center mb-8">Sign in to your account</p>

        {/* Demo hint */}
        <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] px-4 py-3 mb-6 space-y-2">
          <p className="text-xs font-semibold text-primary">Demo credentials</p>
          <div className="border-t border-[var(--border)] pt-2 space-y-1">
            <p className="text-xs font-medium text-primary">Landlord</p>
            <p className="text-xs text-[var(--muted)]">Org slug: <span className="font-mono text-primary">maple-properties</span></p>
            <p className="text-xs text-[var(--muted)]">Email: <span className="font-mono text-primary">landlord@demo.com</span></p>
            <p className="text-xs text-[var(--muted)]">Password: <span className="font-mono text-primary">demo1234</span></p>
          </div>
          <div className="border-t border-[var(--border)] pt-2 space-y-1">
            <p className="text-xs font-medium text-primary">Tenant</p>
            <p className="text-xs text-[var(--muted)]">Org slug: <span className="font-mono text-primary">maple-properties</span></p>
            <p className="text-xs text-[var(--muted)]">Email: <span className="font-mono text-primary">tenant@demo.com</span></p>
            <p className="text-xs text-[var(--muted)]">Password: <span className="font-mono text-primary">demo1234</span></p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Organization slug</label>
            <input
              name="organizationSlug"
              placeholder="e.g. maple-properties"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              placeholder="landlord@demo.com"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
              required
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-primary text-white text-sm font-semibold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 mt-1"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--muted)] text-center">
          Don&apos;t have an account?{' '}
          <Link className="font-semibold text-primary" href="/register">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
