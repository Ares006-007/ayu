"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { getAppointmentsForDoctor } from "@/lib/api";
import { patients } from "@/lib/mock-data";
import { Calendar } from "lucide-react";
import { useState } from "react";

const DOCTOR_ID = "doc-1";

export default function DoctorAppointments() {
  const allAppointments = getAppointmentsForDoctor(DOCTOR_ID);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? allAppointments : allAppointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description="Manage all your appointments.">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-40">
          <option value="all">All statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </PageHeader>

      {filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No appointments" description="No appointments found for this filter." />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((apt) => {
                const patient = patients.find((p) => p.id === apt.patientId);
                return (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">{apt.date} at {apt.time}</TableCell>
                    <TableCell>{patient?.name ?? "—"}</TableCell>
                    <TableCell className="hidden sm:table-cell capitalize text-muted-foreground">{apt.type}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{apt.reason}</TableCell>
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
