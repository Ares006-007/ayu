"use client";

import { useRole } from "@/components/role-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Activity, Package } from "lucide-react";
import { Role } from "@/types";

export default function DemoPage() {
  const { setRole } = useRole();

  const handleRoleSelect = (role: Role) => {
    setRole(role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">AYU</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connected Healthcare Platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select a Demo Role</CardTitle>
            <CardDescription>
              Choose a workspace to explore the platform. This is a local demo session.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              variant="outline"
              className="h-auto flex items-start justify-start gap-4 p-4 text-left"
              onClick={() => handleRoleSelect("patient")}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-foreground">Patient Workspace</span>
                <span className="text-xs font-normal text-muted-foreground">
                  View treatments, medicines, and appointments.
                </span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex items-start justify-start gap-4 p-4 text-left"
              onClick={() => handleRoleSelect("doctor")}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-foreground">Doctor Workspace</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Manage consultations, patients, and prescriptions.
                </span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex items-start justify-start gap-4 p-4 text-left"
              onClick={() => handleRoleSelect("pharmacy")}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <Package className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-foreground">Pharmacy Workspace</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Process prescriptions and manage inventory.
                </span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
