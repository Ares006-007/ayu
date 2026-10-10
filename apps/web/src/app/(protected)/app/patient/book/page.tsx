"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Ticket, Building2, Users } from "lucide-react";

const DEPARTMENTS = [
  { id: "gen", name: "General Medicine", doctor: "Dr. Emily Chen", openTime: "09:00 AM", closeTime: "05:00 PM", tokensLeft: 12, estWait: "45 mins" },
  { id: "cardio", name: "Cardiology", doctor: "Dr. Sarah Jenkins", openTime: "10:00 AM", closeTime: "04:00 PM", tokensLeft: 4, estWait: "1 hr 20 mins" },
  { id: "ortho", name: "Orthopedics", doctor: "Dr. Michael Chang", openTime: "09:00 AM", closeTime: "02:00 PM", tokensLeft: 0, estWait: "Fully Booked" },
  { id: "ped", name: "Pediatrics", doctor: "Dr. James Wilson", openTime: "11:00 AM", closeTime: "06:00 PM", tokensLeft: 18, estWait: "15 mins" },
];

export default function BookAppointment() {
  const router = useRouter();
  const { user } = useAuth();
  const PATIENT_ID = (user?.user as any)?.patientId || "pat-1";

  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleBookToken() {
    if (!selectedDept) return;
    const dept = DEPARTMENTS.find(d => d.id === selectedDept);
    if (!dept || dept.tokensLeft === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/patients/${PATIENT_ID}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: "doc-1", // Hardcoded for demo
          date: new Date().toISOString().split("T")[0],
          timeSlot: dept.estWait,
          symptoms: "Token Booking"
        })
      });

      if (res.ok) {
        router.push("/app/patient");
      } else {
        alert("Failed to generate token.");
      }
    } catch (err) {
      alert("An error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Generate OPD Token" 
        description="Select a department to view current queue status and book your token." 
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">1. Select Department</h3>
          <div className="grid gap-4">
            {DEPARTMENTS.map((dept) => (
              <Card 
                key={dept.id} 
                className={`cursor-pointer transition-all hover:border-primary ${selectedDept === dept.id ? "border-primary ring-1 ring-primary bg-primary/5" : ""} ${dept.tokensLeft === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => dept.tokensLeft > 0 && setSelectedDept(dept.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-lg">{dept.name}</h4>
                    <p className="text-sm text-muted-foreground">{dept.doctor}</p>
                  </div>
                  <div className="text-right">
                    {dept.tokensLeft > 0 ? (
                      <span className="inline-flex items-center text-sm font-medium text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full">
                        {dept.tokensLeft} tokens left
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-sm font-medium text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full">
                        Full
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">2. Queue Status</h3>
          {selectedDept ? (
            <Card className="border-2 border-primary/20 shadow-md">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle>{DEPARTMENTS.find(d => d.id === selectedDept)?.name} OPD</CardTitle>
                <CardDescription>Current live queue status</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="flex items-center text-sm text-muted-foreground"><Building2 className="w-4 h-4 mr-2"/> OPD Timings</span>
                    <span className="font-medium">{DEPARTMENTS.find(d => d.id === selectedDept)?.openTime} - {DEPARTMENTS.find(d => d.id === selectedDept)?.closeTime}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="flex items-center text-sm text-muted-foreground"><Ticket className="w-4 h-4 mr-2"/> Available Tokens</span>
                    <span className="font-medium text-lg">{DEPARTMENTS.find(d => d.id === selectedDept)?.tokensLeft}</span>
                  </div>
                  <div className="flex flex-col space-y-1 col-span-2">
                    <span className="flex items-center text-sm text-muted-foreground"><Clock className="w-4 h-4 mr-2"/> Estimated Turn Time</span>
                    <span className="font-medium text-xl text-primary">{DEPARTMENTS.find(d => d.id === selectedDept)?.estWait}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    className="w-full text-lg h-12" 
                    onClick={handleBookToken}
                    disabled={submitting}
                  >
                    {submitting ? "Generating..." : "Generate My Token Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed flex items-center justify-center h-48 bg-muted/20">
              <div className="text-center text-muted-foreground flex flex-col items-center">
                <Users className="w-8 h-8 mb-2 opacity-20" />
                <p>Select a department to view<br/>live token availability.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
