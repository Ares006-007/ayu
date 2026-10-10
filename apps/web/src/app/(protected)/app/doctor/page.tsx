"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Clock, Users, Bell, AlertCircle, Play, Pause, ChevronRight } from "lucide-react";

export default function DoctorOperationsConsole() {
  const { user } = useAuth();
  const DOCTOR_ID = (user?.user as any)?.doctorId || "doc-1"; 

  const [todaysApts, setTodaysApts] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Live Control State
  const [queueStatus, setQueueStatus] = useState<"OPEN" | "PAUSED">("OPEN");
  const [dailyTokens, setDailyTokens] = useState(20);
  const [slotDuration, setSlotDuration] = useState(15);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

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
        console.error("Failed to load doctor console", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [DOCTOR_ID]);

  if (loading) return <div className="flex h-[calc(100vh-100px)] items-center justify-center">Loading Operations Console...</div>;

  const waitingApts = todaysApts.filter(a => a.status === "SCHEDULED");
  const inProgressApt = todaysApts.find(a => a.status === "IN_PROGRESS");
  const completedApts = todaysApts.filter(a => a.status === "COMPLETED");

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-100px)] overflow-hidden">
      
      {/* ── LEFT RAIL: LIVE QUEUE ── */}
      <div className="md:col-span-3 border-r pr-4 overflow-y-auto space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight mb-2">Today's Queue</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${queueStatus === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {queueStatus === 'OPEN' ? 'Queue Open' : 'Queue Paused'}
            </span>
            <span className="text-xs text-muted-foreground">{todaysApts.length}/{dailyTokens} Tokens</span>
          </div>
        </div>

        {inProgressApt && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
            <p className="text-xs font-semibold text-blue-700 uppercase mb-1">In Consultation</p>
            <p className="font-medium text-sm">{inProgressApt.patient?.user?.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{inProgressApt.reason || 'General'}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 mt-6">Waiting ({waitingApts.length})</h3>
          <div className="space-y-2">
            {waitingApts.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No patients waiting.</p>
            ) : (
              waitingApts.map(apt => (
                <div key={apt.id} className="p-3 border rounded-md hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setSelectedPatientId(apt.id)}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">{apt.patient?.user?.name || 'Unknown'}</p>
                    <span className="text-xs text-muted-foreground">{new Date(apt.startsAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{apt.reason || 'No reason provided'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN PANEL: ACTIVE WORKFLOW ── */}
      <div className="md:col-span-6 overflow-y-auto px-2">
        {!selectedPatientId && !inProgressApt ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
            <Users className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-medium">No Active Patient</h2>
            <p className="text-sm text-muted-foreground">Select a patient from the queue to review their case.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold">Patient Review</h2>
                <p className="text-muted-foreground">Review context and start consultation.</p>
              </div>
              <Link href={`/app/doctor/consultation/${selectedPatientId || inProgressApt?.id}`}>
                <Button>Start Consultation <ChevronRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Unresolved Tasks & Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-amber-50 text-amber-800 rounded-md text-sm border border-amber-200">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Verification Pending</p>
                    <p>AYUSH structured extraction requires human review for 2 fields in a recent lab report.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-md text-sm border border-blue-200">
                  <Bell className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Follow-up Reminder Blocked</p>
                    <p>Patient has not consented to automated Telegram notifications. Manual override required.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical History Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Patient selected from queue. Loading context via read-first resolver...</p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold block mb-1">Active Prescriptions</span>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>Metformin 500mg</li>
                      <li>Atorvastatin 20mg</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">Allergies</span>
                    <p className="text-muted-foreground">Penicillin</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* ── RIGHT RAIL: LIVE CONTROLS ── */}
      <div className="md:col-span-3 border-l pl-4 overflow-y-auto">
        <h2 className="text-lg font-bold tracking-tight mb-4">Operations Console</h2>

        <div className="space-y-6">
          {/* Queue Controls */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Queue Control</h3>
            <div className="flex gap-2">
              <Button 
                variant={queueStatus === 'OPEN' ? 'default' : 'outline'} 
                className="w-full" 
                size="sm"
                onClick={() => setQueueStatus('OPEN')}
              >
                <Play className="h-4 w-4 mr-2" /> Open
              </Button>
              <Button 
                variant={queueStatus === 'PAUSED' ? 'destructive' : 'outline'} 
                className="w-full" 
                size="sm"
                onClick={() => setQueueStatus('PAUSED')}
              >
                <Pause className="h-4 w-4 mr-2" /> Pause
              </Button>
            </div>
          </div>

          {/* Capacity Controls */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Capacity & Slots</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex justify-between">
                Daily Token Limit
                <span className="text-muted-foreground">{todaysApts.length} / {dailyTokens}</span>
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={dailyTokens} 
                  onChange={(e) => setDailyTokens(Number(e.target.value))}
                  className="w-full h-8 rounded-md border border-input bg-transparent px-2 text-sm" 
                />
                <Button size="sm" variant="secondary" onClick={() => alert("Tokens updated.")}>Apply</Button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium flex justify-between">
                Slot Duration (mins)
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={slotDuration} 
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full h-8 rounded-md border border-input bg-transparent px-2 text-sm" 
                />
                <Button size="sm" variant="secondary" onClick={() => alert("Slot duration updated.")}>Apply</Button>
              </div>
            </div>
          </div>

          {/* Reminder & Automation Rules */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Automation Rules</h3>
            
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Auto-Sync Telegram Reminders</p>
                  <p className="text-xs text-muted-foreground">Sends medicine reminders when prescription is verified.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Allow Auto-Booking (AYUSH)</p>
                  <p className="text-xs text-muted-foreground">Allows AI to auto-book follow-ups based on available slots.</p>
                </div>
              </label>
              
              <Button size="sm" variant="outline" className="w-full text-xs">Manage Override Rules</Button>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
