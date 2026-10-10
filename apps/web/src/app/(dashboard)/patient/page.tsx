"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import {
  getAppointmentsForPatient, getActivePrescriptionsForPatient,
  getTodaysDoseEvents, getReportsForPatient, getPatient,
} from "@/lib/api";
import { Calendar, Pill, FileText, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

const PATIENT_ID = "pat-1";

export default function PatientHome() {
  const patient = getPatient(PATIENT_ID)!;
  const allAppointments = getAppointmentsForPatient(PATIENT_ID);
  const upcoming = allAppointments.filter((a) => a.status === "scheduled");
  const nextApt = upcoming[0];
  const activePrescriptions = getActivePrescriptionsForPatient(PATIENT_ID);
  const todaysDoses = getTodaysDoseEvents(PATIENT_ID);
  const takenCount = todaysDoses.filter((d) => d.status === "taken").length;
  const pendingCount = todaysDoses.filter((d) => d.status === "pending").length;
  const recentReports = getReportsForPatient(PATIENT_ID).slice(0, 2);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${patient.name.split(" ")[0]}`}
        description="Here is your health summary for today."
      />

      {/* ── Medicine schedule ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-semibold">Today's Medicines</CardTitle>
          <Link href="/patient/medicines" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {todaysDoses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No medicines scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {todaysDoses.map((dose) => (
                <div key={dose.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${dose.status === "taken" ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                      {dose.status === "taken" ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{dose.medicineName}</p>
                      <p className="text-xs text-muted-foreground">{dose.scheduledTime}</p>
                    </div>
                  </div>
                  <StatusBadge status={dose.status} />
                </div>
              ))}
              <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
                <span>{takenCount} taken</span>
                <span>{pendingCount} pending</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Summary cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {nextApt ? (
              <>
                <p className="text-lg font-semibold">{nextApt.date}</p>
                <p className="text-sm text-muted-foreground">{nextApt.time} — {nextApt.reason}</p>
                <Link href="/patient/appointments">
                  <Button variant="outline" size="sm" className="mt-3 w-full">View Appointments</Button>
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{activePrescriptions.length}</p>
            <p className="text-sm text-muted-foreground">
              {activePrescriptions.length > 0 ? `${activePrescriptions.reduce((s, p) => s + p.items.length, 0)} medicines total` : "No active prescriptions"}
            </p>
            <Link href="/patient/prescriptions">
              <Button variant="outline" size="sm" className="mt-3 w-full">View Prescriptions</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {recentReports.length > 0 ? (
              <div className="space-y-2">
                {recentReports.map((r) => (
                  <div key={r.id} className="text-sm">
                    <p className="font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.date} — {r.labName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent reports.</p>
            )}
            <Link href="/patient/reports">
              <Button variant="outline" size="sm" className="mt-3 w-full">View Reports</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
