from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "HeatShield Sentinel"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"

    # Server configuration
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    LOG_LEVEL: str = "INFO"

    # CORS
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    ADDITIONAL_ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # Operational Mode
    DEMO_MODE: bool = True

    # AWS & Amazon Bedrock
    AWS_REGION: str = "us-east-1"
    BEDROCK_MODEL_ID: str = "anthropic.claude-3-haiku-20240307-v1:0"

    # Meteorological Provider
    ENVIRONMENT_API_BASE_URL: str = "https://api.open-meteo.com/v1"
    ENVIRONMENT_API_KEY: str = ""
    DEFAULT_LATITUDE: float = 22.5726
    DEFAULT_LONGITUDE: float = 88.3639
    DEFAULT_LOCATION_NAME: str = "Kolkata, West Bengal (Barabazar / Sealdah Ward 48)"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def allowed_cors_origins(self) -> List[str]:
        origins = [self.FRONTEND_ORIGIN] + self.ADDITIONAL_ALLOWED_ORIGINS
        return list(set(origins))


settings = Settings()
