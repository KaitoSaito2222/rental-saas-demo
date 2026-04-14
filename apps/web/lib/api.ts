const DEFAULT_BASE_URL = 'http://localhost:3001/api';

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;
}

export function getStoredToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem('property-copilot-token') ?? '';
}

export function setStoredToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem('property-copilot-token', token);
}

export function clearStoredToken() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem('property-copilot-token');
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers ?? {});

  headers.set('Content-Type', 'application/json');

  const token = getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
