"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BookAppointment() {
  const router = useRouter();
  const { user } = useAuth();
  const PATIENT_ID = (user?.user as any)?.patientId || "pat-1";

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !timeSlot || !symptoms) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/patients/${PATIENT_ID}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: "doc-1", // Hardcoded to our demo doctor
          date,
          timeSlot,
          symptoms
        })
      });

      if (res.ok) {
        router.push("/app/patient");
      } else {
        alert("Failed to book appointment.");
      }
    } catch (err) {
      alert("An error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Book Appointment" 
        description="Schedule an OPD consultation with a doctor." 
      />

      <div className="max-w-2xl mx-auto border rounded-xl p-6 bg-background">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Doctor</label>
            <div className="p-3 border rounded-md bg-muted/50">
              <p className="font-medium">Dr. Emily Chen</p>
              <p className="text-sm text-muted-foreground">General Medicine</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input 
                type="date" 
                required 
                value={date} 
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 px-3 text-sm rounded-md border transition-colors ${
                      timeSlot === slot 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Symptoms & Reason for Visit</label>
            <Textarea 
              placeholder="Please briefly describe your symptoms..."
              required
              rows={4}
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="w-full" disabled={submitting || !date || !timeSlot || !symptoms}>
              {submitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
