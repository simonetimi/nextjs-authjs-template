import { auth } from '@/auth';
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGGED_IN_REDIRECT,
  publicRoutes,
} from '@/routes';

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

  // auth routes are not protected, but if the user is logged it redirect to an appropriate route (like user or account)
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGGED_IN_REDIRECT, nextUrl));
    }
    return;
  }

  // if the user is not logged in and is trying to access a non-public route, redirect to login page
  if (!isPublicRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    // this writes on the search params the last url visited, so it will be used when logging in to redirect to appropriate url
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
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
