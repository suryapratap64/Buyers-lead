import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import AuthNav from "@/components/AuthNav";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Lead Management System",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demoAuth = ((await cookies()) as any).get("demo_auth")?.value;

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <header className="bg-white shadow-sm border-b border-gray-200">
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        LeadManager
                      </span>
                    </Link>
                  </div>
                  <div className="hidden md:block ml-10">
                    <div className="flex items-baseline space-x-4">
                      <Link
                        href="/"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/buyers"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        All Leads
                      </Link>
                      <Link
                        href="/buyers/new"
                        className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Add Lead
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <AuthNav />
                </div>
              </div>
            </nav>
          </header>
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
