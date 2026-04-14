export const PERMISSIONS = {
  AUTH_ME_READ: 'auth.me.read',
  DASHBOARD_READ: 'dashboard.read',
  PROPERTY_READ: 'property.read',
  PROPERTY_WRITE: 'property.write',
  PROPERTY_DELETE: 'property.delete',
  APPLICATION_READ: 'application.read',
  APPLICATION_CREATE: 'application.create',
  APPLICATION_REVIEW: 'application.review',
  APPLICATION_DELETE: 'application.delete',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];