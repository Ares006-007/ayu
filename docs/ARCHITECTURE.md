# AYU System Architecture

AYU is designed as a distributed, healthcare-compliant system consisting of a multi-tenant Node.js application layered with a highly isolated Python medical-imaging AI service.

## Core Interaction Flow

1. **Client Applications (Web & Telegram)**
   - The web app (Next.js) handles Doctor, Patient, and Pharmacy interactions.
   - The Telegram bot acts as an interactive assistant for patients.
   - Both clients route exclusively to the `api` service.

2. **Core API Gateway (`apps/api`)**
   - Built on NestJS, this serves as the primary gateway and business logic enforcer.
   - It validates all JWT authentication tokens via Supabase.
   - It enforces multi-tenant organization boundaries and HIPAA-compliant data access rules.
   - It orchestrates the **AI Gateway**, securely forwarding prompts to remote LLM models (e.g. OpenAI/Anthropic/HackClub) using real server-side API keys that are never exposed to the client.

3. **Medical Imaging Python Service (`apps/imaging-api`)**
   - Because Python is the lingua-franca of medical imaging and PyTorch/MONAI, a separate FastAPI service handles raw medical files (DICOM, NIfTI).
   - **Isolation:** The Node.js API never touches raw DICOM pixels. The LLMs never see raw DICOM pixels.
   - When an imaging study is uploaded to S3, the Node.js API issues an internal HTTP call to the Imaging API to parse, validate, and de-identify the scan.
   - The Python service executes the deterministic ML segmentation models and returns *Structured Output* (Measurements, Flags, Radiomics) back to the Node.js API.
   - Only the structured text results are fed to the LLM orchestrator.

## Multi-Agent AI Pipeline

The system uses a strictly controlled multi-agent approach rather than an open "swarm" to ensure medical safety:
- **Router Agent:** Classifies the user intent or upload modality.
- **Extraction Agent:** Converts raw text prescriptions or Telegram messages into structured FHIR-like schemas.
- **Reviewer Agent:** A secondary, higher-tier LLM (e.g., GPT-4o-Pro) that verifies the extraction of high-risk medical data before it is finalized into the database.
- **Medical Imaging Tools:** The AI orchestrator in the API can call predefined tools (e.g., `inspectImagingStudy`, `extractApprovedRadiomics`) that proxy requests to the Python service. The LLM cannot execute arbitrary Python.

## Database
- PostgreSQL is the central database managed via Prisma.
- It contains Tables for Organizations, Users, AI Processing Jobs, AI Review Tasks, and Storage References.
