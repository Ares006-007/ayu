"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { getOrdersForPharmacy, getLowStockItems } from "@/lib/api";
import { patients } from "@/lib/mock-data";
import Link from "next/link";

const PHARMACY_ID = "pha-1";

export default function PharmacyDashboard() {
  const allOrders = getOrdersForPharmacy(PHARMACY_ID);
  
  const toReview = allOrders.filter(o => o.status === "received" || o.status === "reviewing").length;
  const toPrepare = allOrders.filter(o => o.status === "preparing").length;
  const ready = allOrders.filter(o => o.status === "ready").length;
  
  const recentOrders = allOrders.slice(0, 5);
  const lowStock = getLowStockItems(PHARMACY_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="Pharmacy Operations" description="Manage incoming prescriptions, orders, and inventory.">
        <Link href="/pharmacy/orders">
          <Button>View All Orders</Button>
        </Link>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders to Prepare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{toPrepare}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ready for Pickup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{ready}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <CardDescription>Latest orders requiring attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  const patient = patients.find(p => p.id === order.patientId);
                  const dateObj = new Date(order.createdAt);
                  const dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.split('-')[1]}</TableCell>
                      <TableCell>{patient?.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{dateStr}</TableCell>
                      <TableCell className="text-right">₹{order.totalAmount}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">No low stock items.</p>
            ) : (
              <div className="space-y-4">
                {lowStock.map(item => (
                  <div key={item.id} className="flex flex-col gap-1 border-b pb-2 last:border-0">
                    <span className="text-sm font-medium">{item.medicineName}</span>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Stock: {item.currentStock}</span>
                      <span>Reorder: {item.reorderLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
