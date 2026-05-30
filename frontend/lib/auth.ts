import jwt from "jsonwebtoken";

export type UserRole = "admin" | "viewer";

export type AuthUser = {
  email: string;
  name: string;
  role: UserRole;
};

type TokenPayload = {
  email?: string;
  name?: string;
  role?: UserRole;
};

export function getDemoCredentials() {
  return {
    email:
      process.env.DEMO_EMAIL ||
      "demo@supportflow.ai",
    password:
      process.env.DEMO_PASSWORD ||
      "SupportFlowDemo123",
  };
}

export function getUserFromRequest(
  req: Request
): AuthUser | null {
  const cookieHeader =
    req.headers.get("cookie") || "";

  const token = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) =>
      item.startsWith("token=")
    )
    ?.split("=")[1];

  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const payload = jwt.verify(
      decodeURIComponent(token),
      process.env.JWT_SECRET
    ) as TokenPayload;

    if (!payload.email) {
      return null;
    }

    return {
      email: payload.email,
      name:
        payload.name ||
        (payload.role === "viewer"
          ? "Demo Viewer"
          : "Admin"),
      role:
        payload.role === "viewer"
          ? "viewer"
          : "admin",
    };
  } catch {
    return null;
  }
}

export function isReadOnlyUser(
  req: Request
) {
  return getUserFromRequest(req)?.role === "viewer";
}
