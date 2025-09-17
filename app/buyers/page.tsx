import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyer Leads Management",
  description: "Manage and track your buyer leads",
};

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_PAGE_SIZE ?? 10);

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function BuyersList({
  searchParams = {},
}: {
  searchParams?: SearchParams;
}) {
  const queryParams = searchParams ?? {};
  const page = Number(queryParams.page ?? "1");

  const where: any = {};
  if (queryParams.city && typeof queryParams.city === "string")
    where.city = queryParams.city;
  if (queryParams.propertyType && typeof queryParams.propertyType === "string")
    where.propertyType = queryParams.propertyType;
  if (queryParams.status && typeof queryParams.status === "string")
    where.status = queryParams.status;
  if (queryParams.timeline && typeof queryParams.timeline === "string")
    where.timeline = queryParams.timeline;

  if (queryParams.q && typeof queryParams.q === "string") {
    where.OR = [
      { fullName: { contains: queryParams.q, mode: "insensitive" } },
      { email: { contains: queryParams.q, mode: "insensitive" } },
      { phone: { contains: queryParams.q } },
    ];
  }

  const total = await prisma.buyer.count({ where });
  const buyers = await prisma.buyer.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const statusColors: Record<string, string> = {
    New: "bg-blue-100 text-blue-800",
    Contacted: "bg-yellow-100 text-yellow-800",
    Qualified: "bg-green-100 text-green-800",
    Closed: "bg-gray-100 text-gray-800",
    Lost: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lead Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track your buyer leads
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/buyers/new"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Lead
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {buyers.filter((b) => b.status === "New").length}
            </div>
            <div className="text-sm text-gray-600">New</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {buyers.filter((b) => b.status === "Qualified").length}
            </div>
            <div className="text-sm text-gray-600">Qualified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {buyers.filter((b) => b.status === "Contacted").length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buyers.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {buyer.fullName}
                      </div>
                      <div className="text-sm text-gray-500">{buyer.email}</div>
                      <div className="text-sm text-gray-500">{buyer.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {buyer.city}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {buyer.propertyType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {buyer.budgetMin
                      ? `$${buyer.budgetMin.toLocaleString()} - $${
                          buyer.budgetMax?.toLocaleString() ?? "No max"
                        }`
                      : "Not specified"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {buyer.timeline}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[buyer.status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {buyer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(buyer.updatedAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/buyers/${buyer.id}`}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(page * PAGE_SIZE, total)}
              </span>{" "}
              of <span className="font-medium">{total}</span> results
            </p>
            <span className="text-sm text-gray-700">
              Page {page} of {Math.ceil(total / PAGE_SIZE)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
