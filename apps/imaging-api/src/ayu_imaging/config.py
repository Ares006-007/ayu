
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App Config
    APP_NAME: str = "ayu-imaging"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    VERSION: str = "0.1.0"

    # API Config
    API_V1_STR: str = "/internal/v1/imaging"
    CORS_ORIGINS: list[str] = ["*"]
    
    # Internal Auth
    INTERNAL_SERVICE_TOKEN: str = "dev-token-replace-in-prod"
    
    # Storage
    S3_ENDPOINT: str | None = None
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_BUCKET: str = "ayu-imaging-dev"
    S3_SECURE: bool = True
    S3_REGION: str = "us-east-1"
    
    # Database
    DATABASE_URL: str = "postgresql+psycopg://user:password@localhost:5432/ayu_imaging"
    
    # Redis (for Celery)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Model Config
    MODELS_DIR: str = "/tmp/models"
    ENABLE_GPU: bool = False
    
    # Security
    ALLOWED_HOSTS: list[str] = ["*"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
