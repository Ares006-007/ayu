"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getPrescriptionsForPatient } from "@/lib/api";
import { doctors } from "@/lib/mock-data";
import { FileText } from "lucide-react";

const PATIENT_ID = "pat-1";

export default function PatientPrescriptions() {
  const prescriptions = getPrescriptionsForPatient(PATIENT_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" description="All prescriptions issued to you." />

      {prescriptions.length === 0 ? (
        <EmptyState icon={FileText} title="No prescriptions" description="You don't have any prescriptions yet." />
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prx) => {
            const doc = doctors.find((d) => d.id === prx.doctorId);
            return (
              <Card key={prx.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-base">{doc?.name}</CardTitle>
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
                        <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  {prx.notes && <p className="mt-3 text-sm text-muted-foreground border-t pt-3">{prx.notes}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
