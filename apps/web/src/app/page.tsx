"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { workspacePath } from "@/lib/auth/types";

export default function RootPage() {
  const router = useRouter();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/sign-in");
      return;
    }

    if (!user) return;

    if (user.availableWorkspaces.length === 0) {
      router.replace("/access-denied?reason=no-workspace");
      return;
    }

    if (user.availableWorkspaces.length > 1 && !user.activeWorkspace) {
      router.replace("/workspace");
      return;
    }

    const target =
      user.activeWorkspace ?? user.defaultWorkspace ?? user.availableWorkspaces[0].type;
    router.replace(workspacePath(target));
  }, [status, user, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}
