import { cookies } from "next/headers";
import { NextRequest } from "next/server";

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

export function getAuthUser(req: NextRequest): User | null {
  // For API routes
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      // Since we can't use jsonwebtoken in Edge, we'll decode the payload manually
      const [payload] = token.split(".");
      const decodedPayload = JSON.parse(
        Buffer.from(payload, "base64").toString("utf-8")
      );
      return decodedPayload;
    } catch {
      return null;
    }
  }

  // For cookie-based auth (fallback)
  const token = req.cookies.get("demo_auth")?.value;
  if (!token) return null;

  try {
    const [payload] = token.split(".");
    const decodedPayload = JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8")
    );
    return decodedPayload;
  } catch {
    return null;
  }
}
