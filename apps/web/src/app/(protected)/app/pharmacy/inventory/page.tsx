"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInventoryForPharmacy } from "@/lib/api";

const PHARMACY_ID = "pha-1";

export default function PharmacyInventory() {
  const inventory = getInventoryForPharmacy(PHARMACY_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Manage medicine stock and reorder levels.">
        <Button>Add Stock</Button>
      </PageHeader>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead className="hidden md:table-cell">Batch</TableHead>
              <TableHead className="hidden lg:table-cell">Expiry</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              const isLow = item.currentStock <= item.reorderLevel;
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.medicineName}</div>
                    <div className="text-xs text-muted-foreground capitalize">{item.form}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{item.batchNumber}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{item.expiryDate}</TableCell>
                  <TableCell className="text-right text-sm">₹{item.unitPrice}</TableCell>
                  <TableCell className={`text-right font-medium ${isLow ? 'text-destructive' : ''}`}>
                    {item.currentStock}
                  </TableCell>
                  <TableCell className="text-right">
                    {isLow ? (
                      <Badge variant="destructive">Low Stock</Badge>
                    ) : (
                      <Badge variant="success">In Stock</Badge>
                    )}
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
