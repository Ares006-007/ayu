"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { getPatientsByDoctor } from "@/lib/api";
import { Users } from "lucide-react";

const DOCTOR_ID = "doc-1";

export default function DoctorPatients() {
  const myPatients = getPatientsByDoctor(DOCTOR_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="Patients" description="Patients registered under your care." />

      {myPatients.length === 0 ? (
        <EmptyState icon={Users} title="No patients" description="You have no registered patients yet." />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Age / Gender</TableHead>
                <TableHead className="hidden md:table-cell">Blood Group</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myPatients.map((p) => {
                const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{age} / <span className="capitalize">{p.gender}</span></TableCell>
                    <TableCell className="hidden md:table-cell">{p.bloodGroup}</TableCell>
                    <TableCell className="text-muted-foreground">{p.phone}</TableCell>
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
