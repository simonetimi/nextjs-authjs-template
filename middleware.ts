import { auth } from '@/auth';
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGGED_IN_REDIRECT,
  publicRoutes,
} from '@/routes';

// TODO landing page and info page to render independently from authentication

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // api routes shouldn't be protected, so just return
  if (isApiAuthRoute) {
    return;
  }

  // auth routes are not protected, but if the user is logged it redirect to an appropriate route (like profile or settings)
  if (isAuthRoute) {
    if (isLoggedIn) {
      Response.redirect(new URL(DEFAULT_LOGGED_IN_REDIRECT, nextUrl));
    }
    return;
  }

  // if the user is not logged in and is trying to access a non-public route, redirect to login page
  if (!isPublicRoute && !isLoggedIn) {
    return Response.redirect(new URL('/auth/login', nextUrl));
  }

  // if no condition is met, the route is public. allow it
  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
    '/((?!.+\\.[\\w]+$|_next).*)',
    // Re-include any files in the api or trpc folders that might have an extension
    '/(api|trpc)(.*)',
  ],
};
