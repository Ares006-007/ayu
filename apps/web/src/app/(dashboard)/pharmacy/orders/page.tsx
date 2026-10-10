"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getOrdersForPharmacy } from "@/lib/api";
import { patients } from "@/lib/mock-data";
import { useState } from "react";

const PHARMACY_ID = "pha-1";

export default function PharmacyOrders() {
  const allOrders = getOrdersForPharmacy(PHARMACY_ID);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? allOrders : allOrders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Manage all active and past orders.">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-40">
          <option value="all">All statuses</option>
          <option value="received">Received</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
        </Select>
      </PageHeader>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => {
              const patient = patients.find(p => p.id === order.patientId);
              const dateStr = new Date(order.createdAt).toLocaleDateString();
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.split('-')[1]}</TableCell>
                  <TableCell>{patient?.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{dateStr}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
