"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function AccessDeniedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const message =
    reason === "no-workspace"
      ? "No active workspace is available for this account."
      : "You do not have access to this workspace.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-4 rounded-xl border bg-background p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex flex-col gap-2">
          <Link href="/workspace">
            <Button className="w-full">Choose workspace</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" className="w-full">Sign in with a different account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AccessDeniedPage() {
  return (
    <Suspense>
      <AccessDeniedContent />
    </Suspense>
  );
}
