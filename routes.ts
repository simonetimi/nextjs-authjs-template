/**
 * Array of routes that do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ['/', '/auth/verify-email'];

/**
 * Array of routes used for authentication
 * @type {string[]}
 */
export const authRoutes: string[] = [
  '/auth/login',
  '/auth/signup',
  '/auth/error',
];

/**
 * Routes that start with this prefix are essential for authentication
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * Logged in users will be redirected to settings
 * @type {string}
 */
export const DEFAULT_LOGGED_IN_REDIRECT: string = '/settings';
