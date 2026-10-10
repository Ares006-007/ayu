"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  getTodaysAppointmentsForDoctor, getConsultationsForDoctor,
  getPrescriptionsForDoctor, getPatientsByDoctor,
} from "@/lib/api";
import { patients } from "@/lib/mock-data";
import Link from "next/link";

import { useAuth } from "@/components/auth-provider";

export default function DoctorOverview() {
  const { user } = useAuth();
  const DOCTOR_ID = user?.user.email === "doctor@demo.ayu" ? "doc-1" : "doc-1"; // Realistic scenario would use user.doctorId or similar

  const todaysApts = getTodaysAppointmentsForDoctor(DOCTOR_ID);
  const consultations = getConsultationsForDoctor(DOCTOR_ID);
  const recentPrescriptions = getPrescriptionsForDoctor(DOCTOR_ID).filter((p) => p.status === "active");
  const myPatients = getPatientsByDoctor(DOCTOR_ID);

  const waiting = todaysApts.filter((a) => a.status === "scheduled").length;
  const inProgress = todaysApts.filter((a) => a.status === "in-progress").length;
  const completed = todaysApts.filter((a) => a.status === "completed").length;

  const followUps = consultations.filter((c) => c.followUpDate).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description={`${todaysApts.length} appointments today · ${waiting} waiting · ${inProgress} in progress`}>
        <Link href="/doctor/consultations"><Button>New Consultation</Button></Link>
      </PageHeader>

      {/* ── Summary row ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Today's Total</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{todaysApts.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Waiting</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{waiting}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{completed}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Follow-ups Due</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{followUps}</p></CardContent>
        </Card>
      </div>

      {/* ── Today's schedule ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today's Schedule</CardTitle>
          <CardDescription>Appointments for today in order.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaysApts.map((apt) => {
                const patient = patients.find((p) => p.id === apt.patientId);
                return (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">{apt.time}</TableCell>
                    <TableCell>{patient?.name ?? "—"}</TableCell>
                    <TableCell className="hidden sm:table-cell capitalize text-muted-foreground">{apt.type}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{apt.reason}</TableCell>
                    <TableCell><StatusBadge status={apt.status} /></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm">Details & Diagnostics</Button>
                      <Button variant="secondary" size="sm">Request History Access</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Active prescriptions ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Prescriptions</CardTitle>
          <CardDescription>{recentPrescriptions.length} prescriptions currently active.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPrescriptions.map((prx) => {
              const patient = myPatients.find((p) => p.id === prx.patientId);
              return (
                <div key={prx.id} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{patient?.name ?? "Patient"}</p>
                    <p className="text-xs text-muted-foreground">{prx.items.length} medicines · valid until {prx.validUntil}</p>
                  </div>
                  <StatusBadge status={prx.status} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
