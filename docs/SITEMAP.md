# AYU Codebase Sitemap

This document maps out the structure of the AYU monorepo, detailing where different components of the system live.

## Root Directory (`/`)
The root directory orchestrates the entire monorepo using Turborepo/npm workspaces.
- `apps/` - Contains all deployable applications and microservices.
- `packages/` - Contains shared libraries and internal packages used across apps.
- `docs/` - Centralized documentation for the project architecture and flows.
- `docker-compose.yml` - Local development orchestration for core services (database, redis).
- `docker-compose.imaging.yml` - Local development orchestration specifically for the Python medical imaging service.

---

## Applications (`/apps`)

### 1. Backend Core API (`/apps/api`)
**Tech Stack:** NestJS, TypeScript, Prisma, PostgreSQL
**Role:** The central nervous system of AYU. Handles all core business logic, user management, organizations, authentication, and the Multi-Agent AI Gateway.
- `src/ai/` - AI Gateway and Model Orchestration pipeline (Registry, Routers, OpenAI-compatible Proxy).
- `src/auth/` - Authentication and authorization via Supabase.
- `src/telegram/` - External integration with the Telegram bot.
- `src/database/` - Prisma ORM database services.
- `src/organizations/` - Multi-tenant organization boundaries and clinics.

### 2. Frontend Web Portal (`/apps/web`)
**Tech Stack:** Next.js, React, TailwindCSS, TypeScript
**Role:** The web application accessed by Doctors, Patients, and Pharmacy staff.
- `app/` - Next.js App Router structure.
- `components/` - Shared UI components (often mapped to Shadcn UI).
- `lib/` - Shared utilities and API clients.

### 3. Medical Imaging Service (`/apps/imaging-api`)
**Tech Stack:** Python 3.11, FastAPI, uv, PyTorch, MONAI, SimpleITK, PyRadiomics
**Role:** A standalone Python microservice strictly dedicated to parsing medical images (DICOM, NIfTI, NRRD), standardizing orientation, running segmentation pipelines, and extracting radiomics, securely isolated from the generic Node.js backend.
- `src/ayu_imaging/ingestion/` - Parsers for DICOM, NIfTI, and NRRD.
- `src/ayu_imaging/routing/` - Deterministic pipeline router for ML models.
- `src/ayu_imaging/segmentation/` - Adapters for executing segmentation models.
- `src/ayu_imaging/tools/agent_tools.py` - Highly controlled tool definitions exposed to the AI Orchestrator.

### 4. Background Workers (`/apps/worker`)
**Tech Stack:** Node.js, BullMQ, Redis
**Role:** Executes long-running asynchronous jobs offloaded from the Core API (e.g., sending email notifications, heavy background processing tasks).

---

## Internal Packages (`/packages`)

### 1. Database Configuration (`/packages/database`)
**Role:** The centralized Prisma schema definition and migration tracking.
- `prisma/schema.prisma` - The source of truth for the relational PostgreSQL database schema.

### 2. Shared Contracts (`/packages/contracts`)
**Role:** Shared TypeScript interfaces, enums, and Zod schemas that are utilized by both the API and the Web frontend to ensure end-to-end type safety.
