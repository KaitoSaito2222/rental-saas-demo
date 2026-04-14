/**
 * Decode JWT payload without verification (client-side only)
 * This is safe because we only read our own token that the server issued
 */
export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // JWT payload is base64url encoded. Convert it for browser atob decoding.
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export interface JwtPayload {
  sub: string; // userId
  organizationId: string;
  email: string;
  role: 'LANDLORD' | 'PM' | 'TENANT' | 'ADMIN';
  sessionId: string;
}

export function getCurrentUser(): JwtPayload | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = window.localStorage.getItem('rental-demo-token');
  if (!token) return null;

  const decoded = decodeJwt(token);
  if (!decoded) return null;

  return {
    sub: (decoded.sub as string) || '',
    organizationId: (decoded.organizationId as string) || '',
    email: (decoded.email as string) || '',
    role: (decoded.role as JwtPayload['role']) || 'TENANT',
    sessionId: (decoded.sessionId as string) || '',
  };
}
