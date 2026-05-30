import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  
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

  if (!token || !process.env.JWT_SECRET) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(
        process.env.JWT_SECRET
      )
    );

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(
      new URL("/login", req.url)
    );

    response.cookies.delete("token");

    return response;
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
