import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { getDemoCredentials } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email;
    const password = body.password;

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        {
          error: "Server is not configured",
        },
        {
          status: 500,
        }
      );
    }

    const demo = getDemoCredentials();

    const isAdmin =
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD;

    const isDemo =
      email === demo.email &&
      password === demo.password;

    if (!isAdmin && !isDemo) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const token = jwt.sign(
      {
        email,
        name: isDemo
          ? "Demo Viewer"
          : "Admin",
        role: isDemo
          ? "viewer"
          : "admin",
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    const serializedCookie = serialize(
      "token",
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    const response = NextResponse.json({
      success: true,
      role: isDemo ? "viewer" : "admin",
    });

    response.headers.set(
      "Set-Cookie",
      serializedCookie
    );

    return response;

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}
