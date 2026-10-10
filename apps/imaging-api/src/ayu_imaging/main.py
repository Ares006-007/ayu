
import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings

logger = structlog.get_logger()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="AYU Medical Imaging Service",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Set all CORS enabled origins
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.on_event("startup")
async def startup_event() -> None:
    logger.info("Starting up imaging service", version=settings.VERSION, env=settings.ENVIRONMENT)

@app.get("/health/live", tags=["health"])
async def liveness_probe() -> dict[str, str]:
    """Basic health check that the service is running"""
    return {"status": "ok", "service": "imaging-api"}

@app.get("/health/ready", tags=["health"])
async def readiness_probe() -> dict[str, str]:
    """Check dependencies like DB, Redis, S3"""
    # In a full implementation, we would ping dependencies here
    return {"status": "ready"}

# We will include routers later:
# app.include_router(studies.router, prefix=settings.API_V1_STR, dependencies=[Depends(get_current_service)])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ayu_imaging.main:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)
