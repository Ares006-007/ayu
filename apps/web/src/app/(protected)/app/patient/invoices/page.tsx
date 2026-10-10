"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getInvoicesForPatient } from "@/lib/api";
import { FileSpreadsheet } from "lucide-react";

const PATIENT_ID = "pat-1";

export default function PatientInvoices() {
  const invoiceList = getInvoicesForPatient(PATIENT_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description="Your billing history." />

      {invoiceList.length === 0 ? (
        <EmptyState icon={FileSpreadsheet} title="No invoices" description="You don't have any invoices yet." />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden sm:table-cell">Due</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceList.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{inv.dueDate}</TableCell>
                  <TableCell className="text-right">₹{inv.total.toLocaleString("en-IN")}</TableCell>
                  <TableCell><StatusBadge status={inv.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
