"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getPrescriptionsForDoctor } from "@/lib/api";
import { patients } from "@/lib/mock-data";
import { FileText } from "lucide-react";

const DOCTOR_ID = "doc-1";

export default function DoctorPrescriptions() {
  const prescriptions = getPrescriptionsForDoctor(DOCTOR_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" description="Prescriptions you have issued." />

      {prescriptions.length === 0 ? (
        <EmptyState icon={FileText} title="No prescriptions" description="You have not issued any prescriptions." />
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prx) => {
            const patient = patients.find((p) => p.id === prx.patientId);
            return (
              <Card key={prx.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-base">{patient?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{prx.date} · Valid until {prx.validUntil}</p>
                  </div>
                  <StatusBadge status={prx.status} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {prx.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium">{item.medicineName}</p>
                          <p className="text-xs text-muted-foreground">{item.frequency} · {item.timing} · {item.durationDays} days</p>
                        </div>
                      </div>
                    ))}
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
