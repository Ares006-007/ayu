import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockPatients, mockAppointments, mockPrescriptions } from "@/lib/mock-data";
import { Calendar, Pill, FileText } from "lucide-react";

export default function PatientDashboard() {
  const patient = mockPatients[0];
  const nextAppointment = mockAppointments[0];
  const activePrescription = mockPrescriptions[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Good morning, {patient.name.split(' ')[0]}</h1>
        <p className="text-muted-foreground">Here is your health summary for today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nextAppointment.date}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {nextAppointment.time} - {nextAppointment.reason}
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full">View Details</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Medicines</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePrescription.items.length} Pending</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next dose at 2:00 PM
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full">Mark as Taken</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPrescriptions.length} Active</div>
            <p className="text-xs text-muted-foreground mt-1">
              Latest from Dr. Ramesh Kumar
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full">Order Refill</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
