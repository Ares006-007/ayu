"use client";

import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/components/auth-provider";

export default function AdminOverviewPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description={`Managing ${user?.activeWorkspace === "platform_admin" ? "platform" : "clinic"} settings`}
      />
      <p className="text-sm text-muted-foreground">
        Admin workspace for {user?.user.name || user?.user.email}.
      </p>
    </div>
  );
}
