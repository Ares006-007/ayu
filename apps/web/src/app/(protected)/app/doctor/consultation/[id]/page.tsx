"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth-provider";

export default function ConsultationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  
  const [prescriptions, setPrescriptions] = useState([{ medicine: "", dosage: "", instructions: "" }]);

  useEffect(() => {
    // In a real app, fetch appointment details here. For now we just mock loading.
    setTimeout(() => setLoading(false), 500);
  }, [params.id]);

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { medicine: "", dosage: "", instructions: "" }]);
  };

  const updatePrescription = (index: number, field: string, value: string) => {
    const newP = [...prescriptions];
    (newP[index] as any)[field] = value;
    setPrescriptions(newP);
  };

  const [syncTelegram, setSyncTelegram] = useState(true);

  const handleComplete = async () => {
    setSaving(true);
    // In a real app, we would POST this to the backend API
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    
    if (syncTelegram) {
      alert("Consultation saved & E-Prescription instantly sent to Patient's Telegram Bot!");
    } else {
      alert("Consultation saved successfully.");
    }
    router.push("/app/doctor");
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading patient records...</div>;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Live Consultation" 
          description="Patient: Aarav Sharma | Token ID: 62015b8d" 
        />
        <div className="flex flex-col items-end gap-2">
          <div className="space-x-4 flex items-center">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleComplete} disabled={saving}>
              {saving ? "Saving..." : "Complete & Generate E-Prescription"}
            </Button>
          </div>
          <label className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full cursor-pointer">
            <input type="checkbox" checked={syncTelegram} onChange={e => setSyncTelegram(e.target.checked)} className="rounded text-blue-600 border-blue-300 focus:ring-blue-500" />
            <span>Send directly to patient's Telegram</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Input Forms */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Clinical Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Reported Symptoms</label>
                <Textarea 
                  placeholder="Patient reports mild fever and headache..." 
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Provisional Diagnosis</label>
                <Input 
                  placeholder="e.g. Viral Pharyngitis" 
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Doctor's Observation Notes</label>
                <Textarea 
                  placeholder="Throat shows mild erythema. Chest clear..." 
                  className="min-h-[120px]"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>E-Prescription</CardTitle>
              <Button variant="secondary" size="sm" onClick={addPrescription}>+ Add Medicine</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {prescriptions.map((p, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 p-3 border rounded-md bg-muted/20">
                  <div className="col-span-12 md:col-span-5 space-y-1">
                    <label className="text-xs text-muted-foreground">Medicine Name</label>
                    <Input placeholder="e.g. Paracetamol 500mg" value={p.medicine} onChange={e => updatePrescription(i, 'medicine', e.target.value)} />
                  </div>
                  <div className="col-span-6 md:col-span-3 space-y-1">
                    <label className="text-xs text-muted-foreground">Dosage</label>
                    <Input placeholder="1-0-1" value={p.dosage} onChange={e => updatePrescription(i, 'dosage', e.target.value)} />
                  </div>
                  <div className="col-span-6 md:col-span-4 space-y-1">
                    <label className="text-xs text-muted-foreground">Instructions</label>
                    <Input placeholder="After meals" value={p.instructions} onChange={e => updatePrescription(i, 'instructions', e.target.value)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Medical History Context */}
        <div className="space-y-6">
          <Card className="bg-muted/30 h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Patient History</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              <Tabs defaultValue="vitals" className="w-full">
                <TabsList className="w-full rounded-none border-b justify-start h-12">
                  <TabsTrigger value="vitals">Vitals</TabsTrigger>
                  <TabsTrigger value="past">Past Records</TabsTrigger>
                  <TabsTrigger value="lab">Lab Results</TabsTrigger>
                </TabsList>
                
                <TabsContent value="vitals" className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      <p className="font-semibold">120/80 <span className="text-xs font-normal">mmHg</span></p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="font-semibold text-red-500">88 <span className="text-xs font-normal">bpm</span></p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="font-semibold text-orange-500">99.1 <span className="text-xs font-normal">°F</span></p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">SpO2</p>
                      <p className="font-semibold text-green-500">98 <span className="text-xs font-normal">%</span></p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center pt-2">Vitals taken 15 mins ago by Triage Nurse.</p>
                </TabsContent>

                <TabsContent value="past" className="p-4">
                  <div className="space-y-4">
                    <div className="border-l-2 border-primary pl-4 py-1">
                      <p className="text-sm font-medium">Mild Asthma</p>
                      <p className="text-xs text-muted-foreground">Diagnosed 2023. Currently using Albuterol Inhaler PRN.</p>
                    </div>
                    <div className="border-l-2 border-muted pl-4 py-1">
                      <p className="text-sm font-medium">Appendectomy</p>
                      <p className="text-xs text-muted-foreground">Surgical history (2019).</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="lab" className="p-4 text-center text-muted-foreground py-10">
                  No recent lab results found.
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
