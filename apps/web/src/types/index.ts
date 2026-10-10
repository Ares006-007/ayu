// ──────────────────────────────────────────────
// AYU — Core type definitions
// All types use string IDs for future DB compatibility.
// Dates are ISO-8601 strings unless noted.
// ──────────────────────────────────────────────

export type Role = "patient" | "doctor" | "pharmacy";

// ── Users ────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  phone: string;
}

export interface Patient extends User {
  role: "patient";
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodGroup: string;
  allergies: string[];
  emergencyContact?: string;
}

export interface Doctor extends User {
  role: "doctor";
  specialization: string;
  registrationNumber: string;
  experienceYears: number;
  clinicName: string;
  clinicAddress: string;
  consultationFee: number;
}

export interface Pharmacy extends User {
  role: "pharmacy";
  pharmacyName: string;
  address: string;
  licenseNumber: string;
  operatingHours: string;
}

// ── Clinical ────────────────────────────────

export type AppointmentStatus = "scheduled" | "in-progress" | "completed" | "cancelled" | "no-show";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: AppointmentStatus;
  type: "in-person" | "teleconsult";
  reason: string;
  notes?: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  notes: string;
  prescriptionId?: string;
  followUpDate?: string;
}

// ── Medicines & Prescriptions ───────────────

export type MedicineForm = "tablet" | "capsule" | "syrup" | "injection" | "cream" | "drops" | "inhaler";

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: MedicineForm;
  manufacturer: string;
  pricePerUnit: number;
}

export interface PrescriptionItem {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string; // e.g., "1-0-1"
  timing: string;    // e.g., "After meals"
  durationDays: number;
  quantity: number;
  instructions?: string;
}

export type PrescriptionStatus = "active" | "completed" | "cancelled" | "expired";

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  consultationId?: string;
  date: string;
  items: PrescriptionItem[];
  notes?: string;
  status: PrescriptionStatus;
  validUntil: string;
}

// ── Adherence ───────────────────────────────

export interface MedicineSchedule {
  id: string;
  prescriptionId: string;
  prescriptionItemId: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string; // "08:00", "14:00", "21:00"
  timing: string;
}

export type DoseStatus = "pending" | "taken" | "missed" | "skipped";

export interface DoseEvent {
  id: string;
  scheduleId: string;
  patientId: string;
  medicineName: string;
  scheduledTime: string;
  scheduledDate: string;
  status: DoseStatus;
  takenAt?: string;
}

// ── Reports ─────────────────────────────────

export type ReportType = "blood-test" | "imaging" | "pathology" | "general";

export interface Report {
  id: string;
  patientId: string;
  doctorId?: string;
  title: string;
  type: ReportType;
  date: string;
  labName: string;
  summary: string;
  fileUrl?: string;
}

// ── Pharmacy / Orders / Invoices ────────────

export type OrderStatus = "received" | "reviewing" | "preparing" | "ready" | "dispatched" | "delivered" | "cancelled";

export interface PharmacyOrder {
  id: string;
  prescriptionId: string;
  pharmacyId: string;
  patientId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  estimatedReadyAt?: string;
}

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  available: boolean;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  orderId?: string;
  appointmentId?: string;
  patientId: string;
  issuedBy: string; // doctor or pharmacy id
  issuedByRole: "doctor" | "pharmacy";
  date: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  paidAt?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ── Notifications ───────────────────────────

export type NotificationType = "appointment" | "prescription" | "reminder" | "order" | "report" | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// ── Inventory (Pharmacy) ────────────────────

export interface InventoryItem {
  id: string;
  pharmacyId: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  form: MedicineForm;
  currentStock: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
  unitPrice: number;
}
