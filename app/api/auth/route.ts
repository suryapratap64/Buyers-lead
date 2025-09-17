// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

const SECRET = process.env.DEMO_AUTH_SECRET ?? "demo-secret";

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.email || !body?.name)
      return NextResponse.json(
        { error: "name & email required" },
        { status: 400 }
      );

    // First, let's create or get the user from the database
    let user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: body.email,
          name: body.name,
        },
      });
    }

    const payload = JSON.stringify({
      name: user.name,
      email: user.email,
      id: user.id,
    });
    const sig = sign(payload);
    const token = Buffer.from(payload).toString("base64") + "." + sig;

    const res = NextResponse.json({ ok: true });
    // cookie (httpOnly)
    res.cookies.set("demo_auth", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("demo_auth", "", { maxAge: 0, path: "/" });
  return res;
}

export function GET(req: NextRequest) {
  // return current user if cookie valid
  const token = req.cookies.get("demo_auth")?.value;
  if (!token) return NextResponse.json({ user: null });
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return NextResponse.json({ user: null });
  try {
    const payload = Buffer.from(b64, "base64").toString();
    const expected = sign(payload);
    if (expected !== sig) return NextResponse.json({ user: null });
    const user = JSON.parse(payload);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
