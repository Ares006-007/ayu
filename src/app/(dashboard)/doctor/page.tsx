import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockAppointments, mockPatients, mockDoctors } from "@/lib/mock-data";

export default function DoctorDashboard() {
  const doctor = mockDoctors[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Welcome back, {doctor.name}. You have 5 appointments today.</p>
        </div>
        <Button>New Consultation</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Upcoming appointments for the day.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAppointments.map((apt) => {
                  const patient = mockPatients.find(p => p.id === apt.patientId);
                  return (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">{apt.time}</TableCell>
                      <TableCell>{patient?.name}</TableCell>
                      <TableCell className="text-muted-foreground">{apt.reason}</TableCell>
                      <TableCell>
                        <Badge variant={apt.status === 'completed' ? 'secondary' : 'default'}>
                          {apt.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Adherence Alerts</CardTitle>
            <CardDescription>Patients needing attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Priya Patel</p>
                  <p className="text-sm text-muted-foreground">Missed 2 doses of Metformin</p>
                </div>
                <Button variant="outline" size="sm">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
