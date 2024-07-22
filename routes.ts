export const publicRoutes: string[] = ['/', '/auth/verify-email'];

export const authRoutes: string[] = [
  '/auth/login',
  '/auth/signup',
  '/auth/error',
  '/auth/request-password-reset',
  '/auth/password-reset',
];

export const apiAuthPrefix: string = '/api/auth';

export const DEFAULT_LOGGED_IN_REDIRECT: string = '/account';
