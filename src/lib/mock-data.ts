import { Patient, Doctor, Pharmacy, Appointment, Prescription, Medicine, PharmacyOrder } from '../types';

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Aarav Sharma',
    role: 'patient',
    age: 34,
    bloodGroup: 'O+',
    contactNumber: '+91 98765 43210',
  },
  {
    id: 'p2',
    name: 'Priya Patel',
    role: 'patient',
    age: 28,
    bloodGroup: 'A-',
    contactNumber: '+91 98765 12345',
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Ramesh Kumar',
    role: 'doctor',
    specialization: 'Cardiologist',
    experienceYears: 15,
    clinicName: 'Heart Care Clinic',
  }
];

export const mockPharmacies: Pharmacy[] = [
  {
    id: 'ph1',
    name: 'Apollo Pharmacy, Indiranagar',
    role: 'pharmacy',
    address: '100ft Road, Indiranagar, Bangalore',
    licenseNumber: 'KA-B-123456',
  }
];

export const mockMedicines: Medicine[] = [
  { id: 'm1', name: 'Atorvastatin', dosage: '10mg', form: 'tablet' },
  { id: 'm2', name: 'Metformin', dosage: '500mg', form: 'tablet' },
  { id: 'm3', name: 'Amoxicillin', dosage: '250mg', form: 'capsule' },
  { id: 'm4', name: 'Paracetamol', dosage: '650mg', form: 'tablet' },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    doctorId: 'd1',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    status: 'scheduled',
    reason: 'Routine checkup',
  },
  {
    id: 'a2',
    patientId: 'p2',
    doctorId: 'd1',
    date: new Date().toISOString().split('T')[0],
    time: '11:30 AM',
    status: 'completed',
    reason: 'Follow-up for hypertension',
  }
];

export const mockPrescriptions: Prescription[] = [
  {
    id: 'pr1',
    patientId: 'p1',
    doctorId: 'd1',
    date: new Date().toISOString().split('T')[0],
    status: 'active',
    items: [
      { id: 'pi1', medicineId: 'm1', instructions: '1 tablet at night after dinner', durationDays: 30, quantity: 30 },
      { id: 'pi2', medicineId: 'm2', instructions: '1 tablet morning and night after food', durationDays: 30, quantity: 60 }
    ],
    notes: 'Maintain a low-sodium diet.'
  }
];

export const mockOrders: PharmacyOrder[] = [
  {
    id: 'po1',
    prescriptionId: 'pr1',
    pharmacyId: 'ph1',
    patientId: 'p1',
    status: 'preparing',
    totalAmount: 450.00,
    date: new Date().toISOString(),
  }
];
