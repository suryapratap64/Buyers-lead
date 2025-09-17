import BuyerForm from "@/components/BuyerForm";
import Link from "next/link";

export default function NewBuyerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Dashboard</Link>
          <span>/</span>
          <Link href="/buyers" className="hover:text-gray-900">Leads</Link>
          <span>/</span>
          <span className="text-gray-900">New Lead</span>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create New Lead</h1>
          <p className="text-gray-600 mt-1">Enter the buyer's information to create a new lead record.</p>
        </div>
        <div className="p-6">
          <BuyerForm />
        </div>
      </div>
    </div>
  );
}