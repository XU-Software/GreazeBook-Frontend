"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/company/dashboard");
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>✅ Google Sign-In Successful!</h2>
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
