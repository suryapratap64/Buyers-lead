"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AuthNav() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // after sign-out, navigate home
      router.push("/");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  return (
    <div className="space-x-4">
      <Link href="/buyers">Leads</Link>
      <Link href="/buyers/new">New</Link>
      {user ? (
        <button onClick={handleSignOut} className="text-red-600">
          Logout
        </button>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </div>
  );
}
