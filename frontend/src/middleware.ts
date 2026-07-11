import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { canAccessRoute } from "./lib/roles";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const role = (token as any)?.role || "Admin";
    const pathname = req.nextUrl.pathname;

    // Run custom route authorization check
    if (!canAccessRoute(role, pathname)) {
      // Redirect to unauthorized or default dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow public routes
        const path = req.nextUrl.pathname;
        if (path.startsWith("/sign-in") || path.startsWith("/sign-up") || path === "/") {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
