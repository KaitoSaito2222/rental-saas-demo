import { clearStoredToken, getStoredToken, setStoredToken } from './api';

export function saveSession(accessToken: string) {
  setStoredToken(accessToken);
}

export function readSession() {
  return getStoredToken();
}

export function clearSession() {
  clearStoredToken();
}
