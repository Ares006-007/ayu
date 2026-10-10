# AYU - Connected Healthcare Platform

## Product Purpose
AYU is a connected healthcare application designed to serve patients, doctors, and pharmacies through a unified platform. It bridges the gap between consultation, prescription, and medication adherence.

## Technology Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Future Backend:** Supabase / PostgreSQL (not implemented in this phase)

## Application Structure
A single Next.js application containing a shared shell and three distinct workspaces:
- `/patient`: Simplified, reassuring interface for patients.
- `/doctor`: Operational, priority-focused interface for doctors.
- `/pharmacy`: Fulfilment-focused interface for pharmacies.

## Major Components
- Shared Application Shell (Navigation, Header, Profile Menu)
- Role Selection (Demo Login)
- Workspace-specific Dashboards
- Reusable UI Kit (Design System)

## User Roles
1. **Patient:** Manages appointments, views prescriptions, and receives medicine reminders.
2. **Doctor:** Manages schedule, conducts consultations, and tracks patient adherence.
3. **Pharmacy:** Manages incoming prescriptions, order fulfilment, and inventory.

## Current Implementation Status
- Initializing Next.js frontend foundation (in progress).
