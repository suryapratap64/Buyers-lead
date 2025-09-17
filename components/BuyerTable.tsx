"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Buyer {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  propertyType: string;
  budgetMin: number | null;
  budgetMax: number | null;
  timeline: string;
  status: string;
  updatedAt: string;
}

interface BuyerTableProps {
  buyers: Buyer[];
  page: number;
  totalPages: number;
}

export default function BuyerTable({ buyers, page, totalPages }: BuyerTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/buyers?${params.toString()}`);
  };

  return (
    <div>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Phone</th>
            <th className="border p-2 text-left">City</th>
            <th className="border p-2 text-left">Property Type</th>
            <th className="border p-2 text-left">Budget</th>
            <th className="border p-2 text-left">Timeline</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Updated</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buyers.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center p-4 text-gray-500">
                No buyers found
              </td>
            </tr>
          ) : (
            buyers.map((buyer) => (
              <tr key={buyer.id}>
                <td className="border p-2">{buyer.fullName}</td>
                <td className="border p-2">{buyer.phone}</td>
                <td className="border p-2">{buyer.city}</td>
                <td className="border p-2">{buyer.propertyType}</td>
                <td className="border p-2">
                  {buyer.budgetMin ?? "-"} – {buyer.budgetMax ?? "-"}
                </td>
                <td className="border p-2">{buyer.timeline}</td>
                <td className="border p-2">{buyer.status}</td>
                <td className="border p-2">
                  {new Date(buyer.updatedAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <Link href={`/buyers/${buyer.id}`} className="text-blue-600 hover:underline">
                    View / Edit
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 gap-2">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
