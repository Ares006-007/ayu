"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar, Pill, FileText, ArrowRight, CheckCircle2, Clock, MapPin, Activity, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { authApi } from "@/lib/auth/api-client";

export default function PatientHome() {
  const { user } = useAuth();
  const PATIENT_ID = user?.user.patientId || "pat-1";

  const [dashboard, setDashboard] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, profRes] = await Promise.all([
          fetch(`/api/v1/patients/${PATIENT_ID}/dashboard`, { credentials: 'include' }),
          fetch(`/api/v1/patients/${PATIENT_ID}`, { credentials: 'include' })
        ]);

        if (dashRes.ok) setDashboard(await dashRes.json());
        if (profRes.ok) setProfile(await profRes.json());
      } catch (err) {
        console.error("Failed to load patient dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [PATIENT_ID]);

  if (loading) return <div>Loading dashboard...</div>;

  const patientName = profile?.name?.split(" ")[0] || user?.user.name?.split(" ")[0] || "Patient";

  const allAppointments = dashboard?.appointments || [];
  const upcoming = allAppointments.filter((a: any) => a.status === "SCHEDULED" || a.status === "scheduled");
  const nextApt = upcoming[0];
  const activePrescriptions = dashboard?.activePrescriptions || [];
  const todaysDoses = dashboard?.doseEvents || [];
  const takenCount = todaysDoses.filter((d: any) => d.status === "taken").length;
  const pendingCount = todaysDoses.filter((d: any) => d.status === "pending").length;
  const recentReports = dashboard?.recentReports || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${patientName}`}
        description="Here is your health summary for today."
      />

      {/* ── Quick Actions ── */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="font-medium text-sm">Book OPD Appointment</p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-full">
              <MapPin className="h-6 w-6" />
            </div>
            <p className="font-medium text-sm">Find Nearby Hospital</p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
              <Activity className="h-6 w-6" />
            </div>
            <p className="font-medium text-sm">Log Vitals (Sugar, BP)</p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
              <Users className="h-6 w-6" />
            </div>
            <p className="font-medium text-sm">Add Family Member</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ── Vitals & Clinical Levels ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Latest Vitals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <p className="text-sm font-medium">Blood Sugar (Fasting)</p>
                <p className="text-xs text-muted-foreground">Today, 8:00 AM</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">95 mg/dL</p>
                <p className="text-xs text-muted-foreground">Normal</p>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <p className="text-sm font-medium">Blood Pressure</p>
                <p className="text-xs text-muted-foreground">Yesterday, 10:30 AM</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-yellow-600">130/85 mmHg</p>
                <p className="text-xs text-muted-foreground">Elevated</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-sm">View Medical History</Button>
          </CardContent>
        </Card>

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
      </div>

    </div>
  );
}
