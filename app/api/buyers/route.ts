
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { buyerCreateSchema } from "@/lib/validators";
import { allowRequest } from "@/lib/rateLimit";
import { getAuthUser } from "@/lib/auth";

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_PAGE_SIZE ?? 10);

export async function GET(request: NextRequest) {
  // Check authentication first
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // list with filters, pagination, search, sort
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const city = url.searchParams.get("city") ?? undefined;
  const propertyType = url.searchParams.get("propertyType") ?? undefined;
  const status = url.searchParams.get("status") ?? undefined;
  const timeline = url.searchParams.get("timeline") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;

  const where: any = {};
  if (city) where.city = city;
  if (propertyType) where.propertyType = propertyType;
  if (status) where.status = status;
  if (timeline) where.timeline = timeline;
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { notes: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const total = await prisma.buyer.count({ where });
    const buyers = await prisma.buyer.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        fullName: true,
        phone: true,
        city: true,
        propertyType: true,
        budgetMin: true,
        budgetMax: true,
        timeline: true,
        status: true,
        updatedAt: true,
        ownerId: true,
      },
    });

    return NextResponse.json({ buyers, total, page, pageSize: PAGE_SIZE });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    return NextResponse.json(
      { error: "Failed to fetch buyers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateLimitResult = await allowRequest(ip);
  if (!rateLimitResult) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Always get fresh user data from database
  let dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) {
    // If user doesn't exist in database, create them
    try {
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name || user.email.split("@")[0],
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
  }

  const ownerId = dbUser.id;

  const body = await request.json();
  const parsed = buyerCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  // transform Walk-in -> Walk_in for prisma
  const source = body.source === "Walk-in" ? "Walk_in" : body.source;

  // Prepare data mapping for Prisma enums (schema uses mapped enum identifiers)
  const dataToSave: any = {
    ...parsed.data,
    source: source as any,
    tags: parsed.data.tags ?? [],
  };

  // Map timeline from incoming strings to Prisma enum identifiers
  if (dataToSave.timeline) {
    const timelineMap: Record<string, string> = {
      "0-3m": "ZeroToThree",
      "3-6m": "ThreeToSix",
      ">6m": "MoreThanSix",
      Exploring: "Exploring",
    };
    const mappedTimeline = timelineMap[dataToSave.timeline as string];
    if (mappedTimeline) dataToSave.timeline = mappedTimeline;
    else if (dataToSave.timeline === "" || dataToSave.timeline == null)
      delete dataToSave.timeline;
  }

  // Map bhk numeric/string values to Prisma enum identifiers
  if (dataToSave.bhk !== undefined) {
    const bhkMap: Record<string, string> = {
      "1": "One",
      "2": "Two",
      "3": "Three",
      "4": "Four",
      Studio: "Studio",
    };
    const mappedBhk = bhkMap[dataToSave.bhk as string];
    if (mappedBhk) dataToSave.bhk = mappedBhk;
    else if (dataToSave.bhk === "" || dataToSave.bhk == null)
      delete dataToSave.bhk;
  }

  // If propertyType requires bhk, ensure it's present
  if (["Apartment", "Villa"].includes(dataToSave.propertyType)) {
    if (!dataToSave.bhk) {
      return NextResponse.json(
        { error: { bhk: "bhk is required for Apartment and Villa" } },
        { status: 400 }
      );
    }
  }

  if (!ownerId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const created = await prisma.buyer.create({
    data: { ...dataToSave, ownerId },
  });

  // Add history entry
  await prisma.buyerHistory.create({
    data: {
      buyerId: created.id,
      changedBy: (user as any).email ?? ownerId,
      diff: { created: parsed.data },
    },
  });

  return NextResponse.json({ ok: true, buyer: created });
}

// CSV export helper
export async function PUT(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    // Add any additional PUT route logic here if needed
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in PUT request:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
