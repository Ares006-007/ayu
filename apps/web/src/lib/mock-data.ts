// ──────────────────────────────────────────────
// AYU — Mock data for frontend development
// All data is fictional. Indian names and healthcare examples.
// ──────────────────────────────────────────────

import type {
  Patient, Doctor, Pharmacy, Medicine, Appointment,
  Consultation, Prescription, MedicineSchedule, DoseEvent,
  Report, PharmacyOrder, Invoice, Notification, InventoryItem,
} from "@/types";

// ── Helpers ─────────────────────────────────

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

// ── Patients ────────────────────────────────

export const patients: Patient[] = [
  {
    id: "pat-1", name: "Aarav Sharma", email: "aarav@demo.ayu", role: "patient",
    phone: "+91 98765 43210", dateOfBirth: "1992-03-14", gender: "male",
    bloodGroup: "O+", allergies: ["Penicillin"],
  },
  {
    id: "pat-2", name: "Priya Patel", email: "priya@demo.ayu", role: "patient",
    phone: "+91 98765 12345", dateOfBirth: "1998-07-22", gender: "female",
    bloodGroup: "A-", allergies: [],
  },
  {
    id: "pat-3", name: "Rohan Mehta", email: "rohan@demo.ayu", role: "patient",
    phone: "+91 99887 66554", dateOfBirth: "1985-11-05", gender: "male",
    bloodGroup: "B+", allergies: ["Sulfa drugs"],
  },
  {
    id: "pat-4", name: "Anjali Desai", email: "anjali@demo.ayu", role: "patient",
    phone: "+91 97654 32100", dateOfBirth: "2000-01-30", gender: "female",
    bloodGroup: "AB+", allergies: [],
  },
  {
    id: "pat-5", name: "Vikram Singh", email: "vikram@demo.ayu", role: "patient",
    phone: "+91 98123 45678", dateOfBirth: "1978-09-18", gender: "male",
    bloodGroup: "O-", allergies: ["Aspirin"],
  },
  {
    id: "pat-6", name: "Meera Iyer", email: "meera@demo.ayu", role: "patient",
    phone: "+91 90909 12345", dateOfBirth: "1995-04-12", gender: "female",
    bloodGroup: "A+", allergies: [],
  },
];

// ── Doctors ─────────────────────────────────

export const doctors: Doctor[] = [
  {
    id: "doc-1", name: "Dr. Ramesh Kumar", email: "ramesh@demo.ayu", role: "doctor",
    phone: "+91 99001 10011", specialization: "Cardiology",
    registrationNumber: "KMC-12345", experienceYears: 15,
    clinicName: "Heart Care Clinic", clinicAddress: "MG Road, Bangalore",
    consultationFee: 800,
  },
  {
    id: "doc-2", name: "Dr. Sneha Reddy", email: "sneha@demo.ayu", role: "doctor",
    phone: "+91 99002 20022", specialization: "General Medicine",
    registrationNumber: "KMC-23456", experienceYears: 8,
    clinicName: "City Health Centre", clinicAddress: "Koramangala, Bangalore",
    consultationFee: 500,
  },
  {
    id: "doc-3", name: "Dr. Arjun Nair", email: "arjun@demo.ayu", role: "doctor",
    phone: "+91 99003 30033", specialization: "Endocrinology",
    registrationNumber: "KMC-34567", experienceYears: 12,
    clinicName: "Metro Diabetes Centre", clinicAddress: "Indiranagar, Bangalore",
    consultationFee: 1000,
  },
];

// ── Pharmacies ──────────────────────────────

export const pharmacies: Pharmacy[] = [
  {
    id: "pha-1", name: "Ravi (Apollo Pharmacy)", email: "apollo.indiranagar@demo.ayu", role: "pharmacy",
    phone: "+91 80 4567 8901", pharmacyName: "Apollo Pharmacy, Indiranagar",
    address: "100ft Road, Indiranagar, Bangalore 560038",
    licenseNumber: "KA-PH-2024-1234", operatingHours: "8:00 AM – 10:00 PM",
  },
  {
    id: "pha-2", name: "Sita (MedPlus)", email: "medplus.kr@demo.ayu", role: "pharmacy",
    phone: "+91 80 5678 9012", pharmacyName: "MedPlus, Koramangala",
    address: "80ft Road, Koramangala, Bangalore 560034",
    licenseNumber: "KA-PH-2024-5678", operatingHours: "7:00 AM – 11:00 PM",
  },
];

// ── Medicines ───────────────────────────────

export const medicines: Medicine[] = [
  { id: "med-1", name: "Atorvastatin 10mg", genericName: "Atorvastatin", dosage: "10mg", form: "tablet", manufacturer: "Cipla", pricePerUnit: 8.50 },
  { id: "med-2", name: "Metformin 500mg", genericName: "Metformin", dosage: "500mg", form: "tablet", manufacturer: "USV", pricePerUnit: 3.20 },
  { id: "med-3", name: "Amoxicillin 250mg", genericName: "Amoxicillin", dosage: "250mg", form: "capsule", manufacturer: "Mankind", pricePerUnit: 5.00 },
  { id: "med-4", name: "Paracetamol 650mg", genericName: "Paracetamol", dosage: "650mg", form: "tablet", manufacturer: "GSK", pricePerUnit: 2.00 },
  { id: "med-5", name: "Amlodipine 5mg", genericName: "Amlodipine", dosage: "5mg", form: "tablet", manufacturer: "Cipla", pricePerUnit: 6.00 },
  { id: "med-6", name: "Pantoprazole 40mg", genericName: "Pantoprazole", dosage: "40mg", form: "tablet", manufacturer: "Sun Pharma", pricePerUnit: 7.50 },
  { id: "med-7", name: "Cetirizine 10mg", genericName: "Cetirizine", dosage: "10mg", form: "tablet", manufacturer: "Dr. Reddy's", pricePerUnit: 2.50 },
  { id: "med-8", name: "Salbutamol Inhaler", genericName: "Salbutamol", dosage: "100mcg", form: "inhaler", manufacturer: "Cipla", pricePerUnit: 120.00 },
];

// ── Appointments ────────────────────────────

export const appointments: Appointment[] = [
  { id: "apt-1", patientId: "pat-1", doctorId: "doc-1", date: today(), time: "09:00", durationMinutes: 30, status: "completed", type: "in-person", reason: "Routine cardiac checkup" },
  { id: "apt-2", patientId: "pat-2", doctorId: "doc-1", date: today(), time: "09:45", durationMinutes: 30, status: "completed", type: "in-person", reason: "Follow-up for hypertension" },
  { id: "apt-3", patientId: "pat-3", doctorId: "doc-1", date: today(), time: "10:30", durationMinutes: 30, status: "in-progress", type: "in-person", reason: "Chest pain evaluation" },
  { id: "apt-4", patientId: "pat-4", doctorId: "doc-2", date: today(), time: "11:00", durationMinutes: 20, status: "scheduled", type: "teleconsult", reason: "Fever and body aches" },
  { id: "apt-5", patientId: "pat-5", doctorId: "doc-3", date: today(), time: "11:30", durationMinutes: 30, status: "scheduled", type: "in-person", reason: "Diabetes management review" },
  { id: "apt-6", patientId: "pat-6", doctorId: "doc-2", date: today(), time: "14:00", durationMinutes: 20, status: "scheduled", type: "in-person", reason: "Migraine consultation" },
  { id: "apt-7", patientId: "pat-1", doctorId: "doc-1", date: daysFromNow(7), time: "10:00", durationMinutes: 30, status: "scheduled", type: "in-person", reason: "ECG follow-up" },
  { id: "apt-8", patientId: "pat-3", doctorId: "doc-3", date: daysFromNow(3), time: "15:00", durationMinutes: 30, status: "scheduled", type: "teleconsult", reason: "Blood sugar review" },
];

// ── Consultations ───────────────────────────

export const consultations: Consultation[] = [
  { id: "con-1", appointmentId: "apt-1", patientId: "pat-1", doctorId: "doc-1", date: today(), diagnosis: "Stable angina, well controlled", notes: "Continue current medication. Advise stress management.", prescriptionId: "prx-1", followUpDate: daysFromNow(30) },
  { id: "con-2", appointmentId: "apt-2", patientId: "pat-2", doctorId: "doc-1", date: today(), diagnosis: "Essential hypertension, grade I", notes: "BP 140/90. Increase Amlodipine to 10mg. Recheck in 2 weeks.", prescriptionId: "prx-2", followUpDate: daysFromNow(14) },
];

// ── Prescriptions ───────────────────────────

export const prescriptions: Prescription[] = [
  {
    id: "prx-1", patientId: "pat-1", doctorId: "doc-1", consultationId: "con-1",
    date: today(), status: "active", validUntil: daysFromNow(30),
    notes: "Maintain a low-sodium diet. Walk 30 minutes daily.",
    items: [
      { id: "pi-1", medicineId: "med-1", medicineName: "Atorvastatin 10mg", dosage: "10mg", frequency: "0-0-1", timing: "After dinner", durationDays: 30, quantity: 30 },
      { id: "pi-2", medicineId: "med-5", medicineName: "Amlodipine 5mg", dosage: "5mg", frequency: "1-0-0", timing: "Before breakfast", durationDays: 30, quantity: 30 },
    ],
  },
  {
    id: "prx-2", patientId: "pat-2", doctorId: "doc-1", consultationId: "con-2",
    date: today(), status: "active", validUntil: daysFromNow(14),
    notes: "Monitor blood pressure daily. Reduce salt intake.",
    items: [
      { id: "pi-3", medicineId: "med-5", medicineName: "Amlodipine 5mg", dosage: "5mg", frequency: "1-0-1", timing: "After meals", durationDays: 14, quantity: 28 },
    ],
  },
  {
    id: "prx-3", patientId: "pat-5", doctorId: "doc-3",
    date: daysFromNow(-10), status: "active", validUntil: daysFromNow(20),
    notes: "Check fasting blood sugar weekly.",
    items: [
      { id: "pi-4", medicineId: "med-2", medicineName: "Metformin 500mg", dosage: "500mg", frequency: "1-0-1", timing: "After meals", durationDays: 30, quantity: 60 },
      { id: "pi-5", medicineId: "med-6", medicineName: "Pantoprazole 40mg", dosage: "40mg", frequency: "1-0-0", timing: "Before breakfast", durationDays: 30, quantity: 30 },
    ],
  },
  {
    id: "prx-4", patientId: "pat-3", doctorId: "doc-1",
    date: daysFromNow(-60), status: "completed", validUntil: daysFromNow(-30),
    items: [
      { id: "pi-6", medicineId: "med-4", medicineName: "Paracetamol 650mg", dosage: "650mg", frequency: "1-1-1", timing: "After meals", durationDays: 5, quantity: 15 },
    ],
  },
];

// ── Medicine Schedules (patient-1 today) ────

export const medicineSchedules: MedicineSchedule[] = [
  { id: "ms-1", prescriptionId: "prx-1", prescriptionItemId: "pi-2", patientId: "pat-1", medicineName: "Amlodipine 5mg", dosage: "5mg", scheduledTime: "08:00", timing: "Before breakfast" },
  { id: "ms-2", prescriptionId: "prx-1", prescriptionItemId: "pi-1", patientId: "pat-1", medicineName: "Atorvastatin 10mg", dosage: "10mg", scheduledTime: "21:00", timing: "After dinner" },
];

// ── Dose Events (patient-1 today) ───────────

export const doseEvents: DoseEvent[] = [
  { id: "de-1", scheduleId: "ms-1", patientId: "pat-1", medicineName: "Amlodipine 5mg", scheduledTime: "08:00", scheduledDate: today(), status: "taken", takenAt: `${today()}T08:12:00` },
  { id: "de-2", scheduleId: "ms-2", patientId: "pat-1", medicineName: "Atorvastatin 10mg", scheduledTime: "21:00", scheduledDate: today(), status: "pending" },
];

// ── Reports ─────────────────────────────────

export const reports: Report[] = [
  { id: "rpt-1", patientId: "pat-1", doctorId: "doc-1", title: "Lipid Profile", type: "blood-test", date: daysFromNow(-5), labName: "SRL Diagnostics", summary: "Total cholesterol 195 mg/dL. LDL slightly elevated at 130 mg/dL. HDL normal." },
  { id: "rpt-2", patientId: "pat-1", doctorId: "doc-1", title: "ECG Report", type: "general", date: daysFromNow(-5), labName: "Heart Care Clinic", summary: "Normal sinus rhythm. No ST-segment changes." },
  { id: "rpt-3", patientId: "pat-5", doctorId: "doc-3", title: "HbA1c Test", type: "blood-test", date: daysFromNow(-12), labName: "Thyrocare", summary: "HbA1c 7.2%. Slightly above target. Medication adjustment recommended." },
  { id: "rpt-4", patientId: "pat-2", title: "Complete Blood Count", type: "blood-test", date: daysFromNow(-3), labName: "Metropolis", summary: "All values within normal range. Hemoglobin 12.8 g/dL." },
];

// ── Pharmacy Orders ─────────────────────────

export const orders: PharmacyOrder[] = [
  {
    id: "ord-1", prescriptionId: "prx-1", pharmacyId: "pha-1", patientId: "pat-1",
    status: "ready", totalAmount: 435, createdAt: `${daysFromNow(-1)}T10:00:00`, updatedAt: `${today()}T09:30:00`,
    estimatedReadyAt: `${today()}T12:00:00`,
    items: [
      { medicineId: "med-1", medicineName: "Atorvastatin 10mg", quantity: 30, unitPrice: 8.50, available: true },
      { medicineId: "med-5", medicineName: "Amlodipine 5mg", quantity: 30, unitPrice: 6.00, available: true },
    ],
  },
  {
    id: "ord-2", prescriptionId: "prx-2", pharmacyId: "pha-1", patientId: "pat-2",
    status: "preparing", totalAmount: 168, createdAt: `${today()}T08:00:00`, updatedAt: `${today()}T08:15:00`,
    items: [
      { medicineId: "med-5", medicineName: "Amlodipine 5mg", quantity: 28, unitPrice: 6.00, available: true },
    ],
  },
  {
    id: "ord-3", prescriptionId: "prx-3", pharmacyId: "pha-2", patientId: "pat-5",
    status: "delivered", totalAmount: 417, createdAt: `${daysFromNow(-8)}T14:00:00`, updatedAt: `${daysFromNow(-7)}T11:00:00`,
    items: [
      { medicineId: "med-2", medicineName: "Metformin 500mg", quantity: 60, unitPrice: 3.20, available: true },
      { medicineId: "med-6", medicineName: "Pantoprazole 40mg", quantity: 30, unitPrice: 7.50, available: true },
    ],
  },
  {
    id: "ord-4", prescriptionId: "prx-3", pharmacyId: "pha-1", patientId: "pat-5",
    status: "received", totalAmount: 417, createdAt: `${today()}T07:30:00`, updatedAt: `${today()}T07:30:00`,
    items: [
      { medicineId: "med-2", medicineName: "Metformin 500mg", quantity: 60, unitPrice: 3.20, available: true },
      { medicineId: "med-6", medicineName: "Pantoprazole 40mg", quantity: 30, unitPrice: 7.50, available: true },
    ],
  },
  {
    id: "ord-5", prescriptionId: "prx-2", pharmacyId: "pha-1", patientId: "pat-2",
    status: "reviewing", totalAmount: 168, createdAt: `${today()}T09:00:00`, updatedAt: `${today()}T09:00:00`,
    items: [
      { medicineId: "med-5", medicineName: "Amlodipine 5mg", quantity: 28, unitPrice: 6.00, available: true },
    ],
  },
];

// ── Invoices ────────────────────────────────

export const invoices: Invoice[] = [
  {
    id: "inv-1", orderId: "ord-1", patientId: "pat-1", issuedBy: "pha-1", issuedByRole: "pharmacy",
    date: today(), dueDate: daysFromNow(7), status: "sent",
    items: [
      { description: "Atorvastatin 10mg × 30", quantity: 30, unitPrice: 8.50, total: 255 },
      { description: "Amlodipine 5mg × 30", quantity: 30, unitPrice: 6.00, total: 180 },
    ],
    subtotal: 435, tax: 0, total: 435,
  },
  {
    id: "inv-2", appointmentId: "apt-1", patientId: "pat-1", issuedBy: "doc-1", issuedByRole: "doctor",
    date: today(), dueDate: today(), status: "paid", paidAt: `${today()}T10:00:00`,
    items: [
      { description: "Consultation — Cardiology", quantity: 1, unitPrice: 800, total: 800 },
    ],
    subtotal: 800, tax: 0, total: 800,
  },
  {
    id: "inv-3", orderId: "ord-3", patientId: "pat-5", issuedBy: "pha-2", issuedByRole: "pharmacy",
    date: daysFromNow(-7), dueDate: daysFromNow(-2), status: "paid", paidAt: `${daysFromNow(-6)}T16:00:00`,
    items: [
      { description: "Metformin 500mg × 60", quantity: 60, unitPrice: 3.20, total: 192 },
      { description: "Pantoprazole 40mg × 30", quantity: 30, unitPrice: 7.50, total: 225 },
    ],
    subtotal: 417, tax: 0, total: 417,
  },
  {
    id: "inv-4", orderId: "ord-2", patientId: "pat-2", issuedBy: "pha-1", issuedByRole: "pharmacy",
    date: today(), dueDate: daysFromNow(7), status: "draft",
    items: [
      { description: "Amlodipine 5mg × 28", quantity: 28, unitPrice: 6.00, total: 168 },
    ],
    subtotal: 168, tax: 0, total: 168,
  },
];

// ── Notifications ───────────────────────────

export const notifications: Notification[] = [
  { id: "ntf-1", userId: "pat-1", type: "reminder", title: "Evening medicine due", message: "Atorvastatin 10mg — take after dinner.", read: false, createdAt: `${today()}T20:50:00` },
  { id: "ntf-2", userId: "pat-1", type: "appointment", title: "Upcoming appointment", message: "ECG follow-up with Dr. Ramesh Kumar on " + daysFromNow(7) + ".", read: false, createdAt: `${today()}T08:00:00` },
  { id: "ntf-3", userId: "pat-1", type: "order", title: "Order ready for pickup", message: "Your order from Apollo Pharmacy is ready.", read: true, createdAt: `${today()}T09:30:00` },
  { id: "ntf-4", userId: "doc-1", type: "appointment", title: "Next patient waiting", message: "Rohan Mehta — chest pain evaluation.", read: false, createdAt: `${today()}T10:25:00` },
  { id: "ntf-5", userId: "doc-1", type: "prescription", title: "Adherence alert", message: "Priya Patel missed evening dose of Amlodipine.", read: false, createdAt: `${today()}T22:00:00` },
  { id: "ntf-6", userId: "pha-1", type: "prescription", title: "New prescription received", message: "Prescription from Dr. Ramesh Kumar for Aarav Sharma.", read: false, createdAt: `${today()}T10:05:00` },
  { id: "ntf-7", userId: "pha-1", type: "order", title: "Low stock alert", message: "Amlodipine 5mg stock below reorder level.", read: true, createdAt: `${daysFromNow(-1)}T18:00:00` },
];

// ── Inventory (pharmacy-1) ──────────────────

export const inventory: InventoryItem[] = [
  { id: "inv-i-1", pharmacyId: "pha-1", medicineId: "med-1", medicineName: "Atorvastatin 10mg", dosage: "10mg", form: "tablet", currentStock: 250, reorderLevel: 50, batchNumber: "AT-2026-001", expiryDate: "2027-06-30", unitPrice: 8.50 },
  { id: "inv-i-2", pharmacyId: "pha-1", medicineId: "med-2", medicineName: "Metformin 500mg", dosage: "500mg", form: "tablet", currentStock: 180, reorderLevel: 100, batchNumber: "MF-2026-003", expiryDate: "2027-03-15", unitPrice: 3.20 },
  { id: "inv-i-3", pharmacyId: "pha-1", medicineId: "med-3", medicineName: "Amoxicillin 250mg", dosage: "250mg", form: "capsule", currentStock: 90, reorderLevel: 40, batchNumber: "AX-2026-007", expiryDate: "2027-01-20", unitPrice: 5.00 },
  { id: "inv-i-4", pharmacyId: "pha-1", medicineId: "med-4", medicineName: "Paracetamol 650mg", dosage: "650mg", form: "tablet", currentStock: 500, reorderLevel: 100, batchNumber: "PC-2026-012", expiryDate: "2028-01-01", unitPrice: 2.00 },
  { id: "inv-i-5", pharmacyId: "pha-1", medicineId: "med-5", medicineName: "Amlodipine 5mg", dosage: "5mg", form: "tablet", currentStock: 35, reorderLevel: 50, batchNumber: "AM-2026-002", expiryDate: "2027-09-30", unitPrice: 6.00 },
  { id: "inv-i-6", pharmacyId: "pha-1", medicineId: "med-6", medicineName: "Pantoprazole 40mg", dosage: "40mg", form: "tablet", currentStock: 120, reorderLevel: 30, batchNumber: "PP-2026-005", expiryDate: "2027-05-15", unitPrice: 7.50 },
  { id: "inv-i-7", pharmacyId: "pha-1", medicineId: "med-7", medicineName: "Cetirizine 10mg", dosage: "10mg", form: "tablet", currentStock: 300, reorderLevel: 60, batchNumber: "CT-2026-009", expiryDate: "2027-12-01", unitPrice: 2.50 },
  { id: "inv-i-8", pharmacyId: "pha-1", medicineId: "med-8", medicineName: "Salbutamol Inhaler", dosage: "100mcg", form: "inhaler", currentStock: 12, reorderLevel: 10, batchNumber: "SB-2026-001", expiryDate: "2027-04-01", unitPrice: 120.00 },
];
