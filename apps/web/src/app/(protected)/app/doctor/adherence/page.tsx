"use client";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DoctorAdherence() {
  // This would ideally pull from API, for now using mock alert
  return (
    <div className="space-y-6">
      <PageHeader title="Patient Adherence" description="Monitor medicine adherence alerts across your patients." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-destructive flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
            Critical Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Priya Patel</p>
              <p className="text-sm text-muted-foreground">Missed 2 consecutive doses of Amlodipine 5mg.</p>
            </div>
            <Button variant="outline" size="sm">Contact Patient</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Adherence Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState icon={BarChart3} title="No reports generated" description="Check back later for adherence analytics." className="py-8" />
        </CardContent>
      </Card>
    </div>
  );
}
