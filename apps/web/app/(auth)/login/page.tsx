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
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-16">
      <form onSubmit={onSubmit} className="w-full rounded-3xl border border-[var(--panel-border)] bg-white/85 p-8 shadow-soft backdrop-blur">
        <h1 className="text-3xl font-semibold text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Use the demo organization slug and your email.</p>
        <div className="mt-6 space-y-4">
          <input name="organizationSlug" placeholder="organization slug" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
          <input name="email" type="email" placeholder="email" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
          <input name="password" type="password" placeholder="password" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-sand disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        <p className="mt-6 text-sm text-slate-600">
          Need an account? <Link className="font-semibold text-ink underline" href="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}
