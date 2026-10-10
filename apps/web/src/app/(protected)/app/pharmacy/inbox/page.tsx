"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getOrdersForPharmacy } from "@/lib/api";
import { patients } from "@/lib/mock-data";
import { Inbox } from "lucide-react";

const PHARMACY_ID = "pha-1";

export default function PharmacyInbox() {
  const allOrders = getOrdersForPharmacy(PHARMACY_ID);
  // Inbox represents new un-reviewed prescriptions/orders
  const inboxItems = allOrders.filter(o => o.status === "received");

  return (
    <div className="space-y-6">
      <PageHeader title="Prescription Inbox" description="New prescriptions sent to your pharmacy for review." />

      {inboxItems.length === 0 ? (
        <EmptyState icon={Inbox} title="Inbox zero" description="No new prescriptions to review." />
      ) : (
        <div className="space-y-4">
          {inboxItems.map((order) => {
            const patient = patients.find(p => p.id === order.patientId);
            return (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base">{patient?.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Received {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0">
                        <span>{item.medicineName}</span>
                        <span className="text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Accept & Prepare</Button>
                    <Button variant="outline" size="sm">Reject</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
