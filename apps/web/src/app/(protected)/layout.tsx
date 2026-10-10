import { AppShell } from "@/components/layout/app-shell";
import { WorkspaceGuard } from "@/components/workspace-guard";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceGuard>
      <AppShell>{children}</AppShell>
    </WorkspaceGuard>
  );
}
