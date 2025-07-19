import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  // Extract pathname
  const { pathname } = req.nextUrl;

  // Get jwt token from cookie
  const token = req.cookies.get("token")?.value;

  // Allow unauthenticated access to login and public routes
  if (pathname.startsWith("/login")) {
    if (token) {
      // Already logged in → redirect away from login
      return NextResponse.redirect(new URL("/company/dashboard", req.url));
    }
    return NextResponse.next(); // Allow access to login
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Decode jwt and get role data
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role;

    // If user is an admin -> allow all access
    if (role === "admin") {
      return NextResponse.next();
    }

    // If user is regular user -> check allowed paths
    const USER_ALLOWED_ROUTES = [
      "/company/dashboard",
      "/master-data/accounts",
      "/operations/bookings",
      "/operations/orders",
      "/operations/accounts-receivables",
      "/forms",
    ];

    const isAllowed = USER_ALLOWED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (!isAllowed) {
      // User tried to access restricted route
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Allowed route for user
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/login",
    "/login/:path*",
    "/company/:path*",
    "/master-data/:path*",
    "/operations/:path*",
    "/transaction-history/:path*",
    "/forms/:path*",
  ],
};
