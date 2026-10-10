"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/components/role-provider";

export default function RootPage() {
  const router = useRouter();
  const { role, isLoading } = useRole();

  useEffect(() => {
    if (!isLoading) {
      if (role) {
        router.push(`/${role}`);
      } else {
        router.push("/demo");
      }
    }
  }, [role, isLoading, router]);

  return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
}
