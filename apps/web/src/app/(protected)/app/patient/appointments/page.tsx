"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getAppointmentsForPatient } from "@/lib/api";
import { doctors } from "@/lib/mock-data";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { Select } from "@/components/ui/select";

const PATIENT_ID = "pat-1";

export default function PatientAppointments() {
  const allAppointments = getAppointmentsForPatient(PATIENT_ID);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? allAppointments : allAppointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description="Your appointment history and upcoming visits.">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-40">
          <option value="all">All statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </PageHeader>

      {filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No appointments found" description="No appointments match the selected filter." />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden sm:table-cell">Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((apt) => {
                const doc = doctors.find((d) => d.id === apt.doctorId);
                return (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">{apt.date}</TableCell>
                    <TableCell>{apt.time}</TableCell>
                    <TableCell>{doc?.name ?? "—"}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{apt.reason}</TableCell>
                    <TableCell><StatusBadge status={apt.status} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
