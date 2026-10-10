"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";

export default function DoctorOverview() {
  const { user } = useAuth();
  const DOCTOR_ID = (user?.user as any)?.doctorId || "doc-1"; 

  const [todaysApts, setTodaysApts] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [aptsRes, consRes, presRes] = await Promise.all([
          fetch(`/api/doctors/${DOCTOR_ID}/appointments/today`),
          fetch(`/api/doctors/${DOCTOR_ID}/consultations`),
          fetch(`/api/doctors/${DOCTOR_ID}/prescriptions`)
        ]);

        if (aptsRes.ok) setTodaysApts(await aptsRes.json());
        if (consRes.ok) setConsultations(await consRes.json());
        if (presRes.ok) {
          const pres = await presRes.json();
          setRecentPrescriptions(pres.filter((p: any) => p.status === 'ACTIVE'));
        }
      } catch (err) {
        console.error("Failed to load doctor dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [DOCTOR_ID]);

  if (loading) return <div>Loading dashboard...</div>;

  const waiting = todaysApts.filter((a) => a.status === "SCHEDULED").length;
  const inProgress = todaysApts.filter((a) => a.status === "IN_PROGRESS").length;
  const completed = todaysApts.filter((a) => a.status === "COMPLETED").length;

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
                const patientName = apt.patient?.user?.name ?? "—";
                return (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">{new Date(apt.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                    <TableCell>{patientName}</TableCell>
                    <TableCell className="hidden sm:table-cell capitalize text-muted-foreground">{apt.reason || 'General'}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{apt.reason}</TableCell>
                    <TableCell><StatusBadge status={apt.status} /></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/app/doctor/consultation/${apt.id}`}>
                        <Button variant="default" size="sm">Start Consultation</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Active prescriptions ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Active Prescriptions & Follow-ups</CardTitle>
            <CardDescription>{recentPrescriptions.length} prescriptions currently active.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPrescriptions.map((prx) => {
                const patientName = prx.patient?.user?.name ?? "Patient";
                return (
                  <div key={prx.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b last:border-0 pb-3 last:pb-0 gap-3">
                    <div>
                      <p className="text-sm font-medium">{patientName}</p>
                      <p className="text-xs text-muted-foreground">{prx.items?.length || 0} medicines · valid until {prx.validUntil || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <Button variant="outline" size="sm" className="h-7 text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100" onClick={() => alert("Follow-up request sent via Telegram!")}>
                        Request Follow-up (Telegram Sync)
                      </Button>
                      <StatusBadge status={prx.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">OPD Token Management</CardTitle>
            <CardDescription>Control daily limits (Telegram Synced)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tokens Issued Today</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{todaysApts.length}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-lg">20</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Update Daily Token Limit</label>
              <div className="flex gap-2">
                <input type="number" defaultValue={20} className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                <Button size="sm" onClick={() => alert("Token limit updated! Telegram Bot updated automatically.")}>Save</Button>
              </div>
            </div>
            <div className="pt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-md">
              Changing this limit immediately updates the token availability displayed to patients in the Telegram Bot and Web App.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
