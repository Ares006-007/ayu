"use client";

import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { getTodaysDoseEvents, getMedicineSchedulesForPatient } from "@/lib/api";
import { CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PATIENT_ID = "pat-1";

export default function PatientMedicines() {
  const schedules = getMedicineSchedulesForPatient(PATIENT_ID);
  const todaysDoses = getTodaysDoseEvents(PATIENT_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="Medicines" description="Your daily medicine schedule and adherence." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {todaysDoses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No medicines scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {todaysDoses.map((dose) => (
                <div key={dose.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${dose.status === "taken" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {dose.status === "taken" ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{dose.medicineName}</p>
                      <p className="text-xs text-muted-foreground">Scheduled at {dose.scheduledTime}</p>
                    </div>
                  </div>
                  <StatusBadge status={dose.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Active Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No active medicine schedules.</p>
          ) : (
            <div className="space-y-3">
              {schedules.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{s.medicineName}</p>
                    <p className="text-xs text-muted-foreground">{s.dosage} · {s.timing}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{s.scheduledTime}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
