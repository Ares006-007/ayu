// ──────────────────────────────────────────────
// AYU — Data access layer
// Currently reads from mock-data.ts.
// Replace internals with Supabase/API calls later
// without changing the function signatures.
// ──────────────────────────────────────────────

import {
  patients, doctors, pharmacies, medicines,
  appointments, consultations, prescriptions,
  medicineSchedules, doseEvents, reports,
  orders, invoices, notifications, inventory,
} from "./mock-data";

import type {
  Patient, Doctor, Pharmacy, Medicine,
  Appointment, Consultation, Prescription,
  MedicineSchedule, DoseEvent, Report,
  PharmacyOrder, Invoice, Notification, InventoryItem,
} from "@/types";

// ── Patient ─────────────────────────────────

export function getPatient(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

export function getAllPatients(): Patient[] {
  return patients;
}

export function getPatientsByDoctor(doctorId: string): Patient[] {
  const patientIds = new Set(
    appointments.filter((a) => a.doctorId === doctorId).map((a) => a.patientId)
  );
  return patients.filter((p) => patientIds.has(p.id));
}

// ── Doctor ──────────────────────────────────

export function getDoctor(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}

export function getAllDoctors(): Doctor[] {
  return doctors;
}

// ── Pharmacy ────────────────────────────────

export function getPharmacy(id: string): Pharmacy | undefined {
  return pharmacies.find((p) => p.id === id);
}

// ── Appointments ────────────────────────────

export function getAppointmentsForPatient(patientId: string): Appointment[] {
  return appointments.filter((a) => a.patientId === patientId);
}

export function getAppointmentsForDoctor(doctorId: string): Appointment[] {
  return appointments.filter((a) => a.doctorId === doctorId);
}

export function getTodaysAppointmentsForDoctor(doctorId: string): Appointment[] {
  const today = new Date().toISOString().split("T")[0];
  return appointments.filter((a) => a.doctorId === doctorId && a.date === today);
}

// ── Consultations ───────────────────────────

export function getConsultationsForDoctor(doctorId: string): Consultation[] {
  return consultations.filter((c) => c.doctorId === doctorId);
}

export function getConsultationsForPatient(patientId: string): Consultation[] {
  return consultations.filter((c) => c.patientId === patientId);
}

// ── Prescriptions ───────────────────────────

export function getPrescriptionsForPatient(patientId: string): Prescription[] {
  return prescriptions.filter((p) => p.patientId === patientId);
}

export function getPrescriptionsForDoctor(doctorId: string): Prescription[] {
  return prescriptions.filter((p) => p.doctorId === doctorId);
}

export function getActivePrescriptionsForPatient(patientId: string): Prescription[] {
  return prescriptions.filter((p) => p.patientId === patientId && p.status === "active");
}

// ── Medicine Schedules & Doses ──────────────

export function getMedicineSchedulesForPatient(patientId: string): MedicineSchedule[] {
  return medicineSchedules.filter((s) => s.patientId === patientId);
}

export function getTodaysDoseEvents(patientId: string): DoseEvent[] {
  const today = new Date().toISOString().split("T")[0];
  return doseEvents.filter((d) => d.patientId === patientId && d.scheduledDate === today);
}

// ── Medicines ───────────────────────────────

export function getMedicine(id: string): Medicine | undefined {
  return medicines.find((m) => m.id === id);
}

export function getAllMedicines(): Medicine[] {
  return medicines;
}

// ── Reports ─────────────────────────────────

export function getReportsForPatient(patientId: string): Report[] {
  return reports.filter((r) => r.patientId === patientId);
}

// ── Orders ──────────────────────────────────

export function getOrdersForPharmacy(pharmacyId: string): PharmacyOrder[] {
  return orders.filter((o) => o.pharmacyId === pharmacyId);
}

export function getOrdersForPatient(patientId: string): PharmacyOrder[] {
  return orders.filter((o) => o.patientId === patientId);
}

// ── Invoices ────────────────────────────────

export function getInvoicesForPatient(patientId: string): Invoice[] {
  return invoices.filter((i) => i.patientId === patientId);
}

export function getInvoicesForIssuer(issuerId: string): Invoice[] {
  return invoices.filter((i) => i.issuedBy === issuerId);
}

// ── Notifications ───────────────────────────

export function getNotificationsForUser(userId: string): Notification[] {
  return notifications.filter((n) => n.userId === userId).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getUnreadCount(userId: string): number {
  return notifications.filter((n) => n.userId === userId && !n.read).length;
}

// ── Inventory ───────────────────────────────

export function getInventoryForPharmacy(pharmacyId: string): InventoryItem[] {
  return inventory.filter((i) => i.pharmacyId === pharmacyId);
}

export function getLowStockItems(pharmacyId: string): InventoryItem[] {
  return inventory.filter((i) => i.pharmacyId === pharmacyId && i.currentStock <= i.reorderLevel);
}
