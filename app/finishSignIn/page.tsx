"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function FinishSignInPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Checking link...");

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");

      if (!email) {
        email = window.prompt("Please confirm your email");
      }

      signInWithEmailLink(auth, email!, window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
          setMessage("✅ Signed in successfully!");
          router.push("/"); // redirect to home after login
        })
        .catch((err) => {
          console.error("signInWithEmailLink error:", err);
          setMessage(`❌ Error signing in: ${err?.message ?? "unknown"}`);
        });
    }
  }, [router]);

  return <p>{message}</p>;
}
