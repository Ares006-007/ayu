# AYU Medical Platform

AYU is a distributed, healthcare-compliant multi-agent orchestration platform.

## Documentation

The codebase has been restructured into a clean monorepo. Please refer to the `docs/` directory for detailed information:

- **[Project Sitemap](docs/SITEMAP.md)**: Find exactly where code lives in the `apps/` and `packages/` folders.
- **[System Architecture](docs/ARCHITECTURE.md)**: Understand how the Node.js API, the Python Medical Imaging service, and the AI Gateway interact.
- [Legacy Overview](docs/overview.md)
- [Legacy Flow](docs/flow.md)
- [Changelog](docs/changelog.md)

## Monorepo Apps
- `apps/api` - Core NestJS Backend & AI Gateway. Handles auth, database access, and LLM proxying.
- `apps/web` - NextJS Web Portal. The UI for doctors and patients.
- `apps/imaging-api` - Python FastAPI Medical Imaging Pipeline. Dedicated DICOM parser and ML segmentation engine.

## Getting Started
Ensure you have Docker installed, then run:
```bash
docker-compose up -d
```
To spin up the local development dependencies.
