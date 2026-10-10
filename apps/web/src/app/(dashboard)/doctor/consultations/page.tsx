"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getConsultationsForDoctor } from "@/lib/api";
import { patients } from "@/lib/mock-data";
import { Stethoscope } from "lucide-react";

const DOCTOR_ID = "doc-1";

export default function DoctorConsultations() {
  const consultations = getConsultationsForDoctor(DOCTOR_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="Consultations" description="Consultation notes and diagnoses." />

      {consultations.length === 0 ? (
        <EmptyState icon={Stethoscope} title="No consultations" description="No consultation records found." />
      ) : (
        <div className="space-y-4">
          {consultations.map((c) => {
            const patient = patients.find((p) => p.id === c.patientId);
            return (
              <Card key={c.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{patient?.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">{c.date}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Diagnosis: </span>
                      <span className="text-muted-foreground">{c.diagnosis}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Notes: </span>
                      <span className="text-muted-foreground">{c.notes}</span>
                    </div>
                    {c.followUpDate && (
                      <div className="pt-2">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                          Follow-up: {c.followUpDate}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
