
import structlog
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ..config import settings

logger = structlog.get_logger()
security = HTTPBearer()

async def get_current_service(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Validates that the incoming request has a valid service token.
    This service is meant to be called ONLY internally by the Node/NestJS backend.
    """
    token = credentials.credentials
    if token != settings.INTERNAL_SERVICE_TOKEN:
        logger.warning("Unauthorized access attempt with invalid service token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid service token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return "ayu-core-api"
