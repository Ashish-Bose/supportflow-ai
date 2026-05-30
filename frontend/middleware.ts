import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

  try {
    jwt.verify(token, process.env.JWT_SECRET!);

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tickets/:path*",
    "/customers/:path*",
    "/analytics/:path*",
  ],
};