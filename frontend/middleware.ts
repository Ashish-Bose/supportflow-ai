import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  
  const token = req.cookies.get("token")?.value;

  const protectedRoutes = [
  "/dashboard",
  "/tickets",
  "/customers",
  "/analytics",
];

const isProtectedRoute =
  protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

if (!isProtectedRoute) {
  return NextResponse.next();
}

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tickets/:path*",
    "/customers/:path*",
    "/analytics/:path*",
  ],
};