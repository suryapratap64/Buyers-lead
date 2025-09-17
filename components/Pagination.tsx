import prisma from "@/lib/prisma";
import BuyerTable from "@/components/BuyerTable";

interface BuyersPageProps {
  searchParams: {
    page?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
    q?: string; // search query
  };
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  const params = (await searchParams) as { [key: string]: string | undefined };
  const pageSize = 10;
  const page = Number(params.page ?? "1");

  const where: any = {};

  if (params.city) where.city = params.city;
  if (params.propertyType) where.propertyType = params.propertyType;
  if (params.status) where.status = params.status;
  if (params.timeline) where.timeline = params.timeline;

  if (params.q) {
    where.OR = [
      { fullName: { contains: params.q, mode: "insensitive" } },
      { email: { contains: params.q, mode: "insensitive" } },
      { phone: { contains: params.q, mode: "insensitive" } },
    ];
  }

  const [buyers, totalCount] = await Promise.all([
    prisma.buyer.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.buyer.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Buyer Leads</h1>
      <BuyerTable buyers={buyers} page={page} totalPages={totalPages} />
    </div>
  );
}
