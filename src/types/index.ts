export type Role = 'patient' | 'doctor' | 'pharmacy';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export interface Patient extends User {
  role: 'patient';
  age: number;
  bloodGroup: string;
  contactNumber: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  experienceYears: number;
  clinicName: string;
}

export interface Pharmacy extends User {
  role: 'pharmacy';
  address: string;
  licenseNumber: string;
}

export type AppointmentStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  form: 'tablet' | 'syrup' | 'injection' | 'capsule';
}

export interface PrescriptionItem {
  id: string;
  medicineId: string;
  instructions: string; // e.g., "1-0-1 after meals"
  durationDays: number;
  quantity: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  items: PrescriptionItem[];
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'dispatched' | 'delivered';

export interface PharmacyOrder {
  id: string;
  prescriptionId: string;
  pharmacyId: string;
  patientId: string;
  status: OrderStatus;
  totalAmount: number;
  date: string;
}
