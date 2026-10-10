"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getInvoicesForIssuer } from "@/lib/api";
import { patients } from "@/lib/mock-data";
import { FileSpreadsheet } from "lucide-react";

const PHARMACY_ID = "pha-1";

export default function PharmacyInvoices() {
  const invoiceList = getInvoicesForIssuer(PHARMACY_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description="Manage billing and payments." />

      {invoiceList.length === 0 ? (
        <EmptyState icon={FileSpreadsheet} title="No invoices" description="You have not issued any invoices yet." />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceList.map((inv) => {
                const patient = patients.find(p => p.id === inv.patientId);
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.id}</TableCell>
                    <TableCell>{patient?.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{inv.date}</TableCell>
                    <TableCell className="text-right">₹{inv.total}</TableCell>
                    <TableCell><StatusBadge status={inv.status} /></TableCell>
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
