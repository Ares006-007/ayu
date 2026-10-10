"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { patients, orders } from "@/lib/mock-data";

const PHARMACY_ID = "pha-1";

export default function PharmacyCustomers() {
  // Derive customers from orders for this pharmacy
  const myOrderPatientIds = new Set(
    orders.filter(o => o.pharmacyId === PHARMACY_ID).map(o => o.patientId)
  );
  
  const customers = patients.filter(p => myOrderPatientIds.has(p.id));

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Patients who have ordered from your pharmacy." />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{c.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
