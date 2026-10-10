"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getReportsForPatient } from "@/lib/api";
import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PATIENT_ID = "pat-1";

const TYPE_LABELS: Record<string, string> = {
  "blood-test": "Blood Test",
  "imaging": "Imaging",
  "pathology": "Pathology",
  "general": "General",
};

export default function PatientReports() {
  const reports = getReportsForPatient(PATIENT_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Lab results and diagnostic reports." />

      {reports.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No reports" description="No reports have been uploaded yet." />
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <Card key={r.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">{r.title}</CardTitle>
                <Badge variant="secondary">{TYPE_LABELS[r.type] ?? r.type}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{r.summary}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>{r.date}</span>
                  <span>{r.labName}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
