'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { saveSession } from '../../../lib/auth';

type RegisterResponse = {
  accessToken: string;
  expiresAt: string;
  user: { id: string; email: string; role: string; organizationId: string };
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);

    try {
      const response = await apiFetch<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          organizationName: String(formData.get('organizationName') ?? ''),
          organizationSlug: String(formData.get('organizationSlug') ?? ''),
          country: String(formData.get('country') ?? 'CA'),
          timezone: String(formData.get('timezone') ?? 'America/Vancouver'),
          email: String(formData.get('email') ?? ''),
          password: String(formData.get('password') ?? ''),
          role: String(formData.get('role') ?? 'LANDLORD'),
        }),
      });

      saveSession(response.accessToken);
      router.push('/dashboard');
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-16">
      <form onSubmit={onSubmit} className="w-full rounded-3xl border border-[var(--panel-border)] bg-white/85 p-8 shadow-soft backdrop-blur">
        <h1 className="text-3xl font-semibold text-ink">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">Create the demo organization and your first user.</p>
        <div className="mt-6 space-y-4">
          <input name="organizationName" placeholder="organization name" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
          <input name="organizationSlug" placeholder="organization slug" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
          <select name="role" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <option value="LANDLORD">Landlord</option>
            <option value="TENANT">Tenant</option>
            <option value="PM">Property Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
          <input name="country" defaultValue="CA" placeholder="country" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
          <input name="timezone" defaultValue="America/Vancouver" placeholder="timezone" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
          <input name="email" type="email" placeholder="email" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
          <input name="password" type="password" placeholder="password" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" required />
          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-sand disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
        <p className="mt-6 text-sm text-slate-600">
          Already have an account? <Link className="font-semibold text-ink underline" href="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
