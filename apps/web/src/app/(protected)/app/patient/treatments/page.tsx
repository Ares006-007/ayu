"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getActivePrescriptionsForPatient } from "@/lib/api";
import { doctors } from "@/lib/mock-data";

const PATIENT_ID = "pat-1";

export default function PatientTreatments() {
  const prescriptions = getActivePrescriptionsForPatient(PATIENT_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="My Treatments" description="Your active treatment plans and medications." />

      {prescriptions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No active treatments.</p>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prx) => {
            const doc = doctors.find((d) => d.id === prx.doctorId);
            return (
              <Card key={prx.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-base">{doc?.name ?? "Doctor"}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{doc?.specialization} — prescribed {prx.date}</p>
                  </div>
                  <StatusBadge status={prx.status} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {prx.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b last:border-0 py-2">
                        <div>
                          <p className="text-sm font-medium">{item.medicineName}</p>
                          <p className="text-xs text-muted-foreground">{item.frequency} · {item.timing} · {item.durationDays} days</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.quantity} units</span>
                      </div>
                    ))}
                  </div>
                  {prx.notes && (
                    <p className="mt-3 text-sm text-muted-foreground border-t pt-3">{prx.notes}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
