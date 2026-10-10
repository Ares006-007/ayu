"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { workspaceFromPath } from "@/lib/auth/types";

export function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" || !user) return;

    const required = workspaceFromPath(pathname);
    if (!required) return;

    const allowed = user.availableWorkspaces.some(
      (w) =>
        w.type === required &&
        (user.activeOrganizationId
          ? w.organizationId === user.activeOrganizationId || w.type === "patient"
          : true),
    );

    if (!allowed) {
      router.replace("/access-denied");
      return;
    }

    if (user.activeWorkspace && user.activeWorkspace !== required) {
      router.replace("/access-denied");
    }
  }, [status, user, pathname, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
