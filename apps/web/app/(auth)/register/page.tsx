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
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-primary text-center mb-1">Create account</h1>
        <p className="text-sm text-[var(--muted)] text-center mb-8">Set up your organization</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Organization name</label>
            <input
              name="organizationName"
              placeholder="e.g. Maple Properties"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
              required
            />
          </div>
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
            <label className="block text-sm font-medium text-primary mb-1.5">Role</label>
            <select
              name="role"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
            >
              <option value="LANDLORD">Landlord</option>
              <option value="TENANT">Tenant</option>
              <option value="PM">Property Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Country</label>
            <input
              name="country"
              defaultValue="CA"
              placeholder="CA"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Timezone</label>
            <input
              name="timezone"
              defaultValue="America/Vancouver"
              placeholder="America/Vancouver"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
              required
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-primary text-white text-sm font-semibold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--muted)] text-center">
          Already have an account?{' '}
          <Link className="font-semibold text-primary" href="/login">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
