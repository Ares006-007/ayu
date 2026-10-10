"use client";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Clock } from "lucide-react";
import { getConsultationsForDoctor } from "@/lib/api";
import { patients } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DOCTOR_ID = "doc-1";

export default function DoctorFollowUps() {
  const followUps = getConsultationsForDoctor(DOCTOR_ID).filter((c) => c.followUpDate);

  return (
    <div className="space-y-6">
      <PageHeader title="Follow-ups" description="Patients scheduled for follow-up visits." />

      {followUps.length === 0 ? (
        <EmptyState icon={Clock} title="No follow-ups" description="No patients require a follow-up at this time." />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Follow-up Date</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Last Diagnosis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followUps.map((c) => {
                const patient = patients.find((p) => p.id === c.patientId);
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-primary">{c.followUpDate}</TableCell>
                    <TableCell>{patient?.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.diagnosis}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
