"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import type { WorkspaceDescriptor } from "@/lib/auth/types";

export default function WorkspacePage() {
  const { user, status, switchWorkspace, logout } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const workspaces = user.availableWorkspaces;

  async function select(ws: WorkspaceDescriptor) {
    await switchWorkspace(ws.type, ws.organizationId);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-lg space-y-6 rounded-xl border bg-background p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">Choose a workspace</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as {user.user.name || user.user.email}
          </p>
        </div>

        {workspaces.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No active workspace is available for this account.
          </p>
        ) : (
          <ul className="space-y-2">
            {workspaces.map((ws) => (
              <li key={`${ws.type}-${ws.organizationId ?? "default"}`}>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => select(ws)}
                >
                  <span className="font-medium">{ws.label}</span>
                </Button>
              </li>
            ))}
          </ul>
        )}

        <Button variant="ghost" className="w-full" onClick={() => logout()}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
