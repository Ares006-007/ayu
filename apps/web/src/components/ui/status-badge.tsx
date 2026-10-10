import { Badge } from "./badge";
import type { BadgeProps } from "./badge";
import type {
  AppointmentStatus, PrescriptionStatus, OrderStatus, InvoiceStatus, DoseStatus,
} from "@/types";

type AnyStatus = AppointmentStatus | PrescriptionStatus | OrderStatus | InvoiceStatus | DoseStatus;

const statusVariantMap: Record<string, BadgeProps["variant"]> = {
  // appointments
  scheduled: "outline",
  "in-progress": "default",
  completed: "success",
  cancelled: "destructive",
  "no-show": "destructive",
  // prescriptions
  active: "success",
  expired: "secondary",
  // orders
  received: "outline",
  reviewing: "outline",
  preparing: "warning",
  ready: "success",
  dispatched: "default",
  delivered: "success",
  // invoices
  draft: "secondary",
  sent: "outline",
  paid: "success",
  overdue: "destructive",
  // doses
  pending: "outline",
  taken: "success",
  missed: "destructive",
  skipped: "warning",
};

const statusLabelMap: Record<string, string> = {
  "in-progress": "In Progress",
  "no-show": "No Show",
};

export function StatusBadge({ status }: { status: AnyStatus }) {
  const variant = statusVariantMap[status] ?? "secondary";
  const label = statusLabelMap[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
  return <Badge variant={variant}>{label}</Badge>;
}
