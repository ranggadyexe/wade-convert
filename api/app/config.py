from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    max_upload_mb: int = 20
    max_pdf_pages: int = 100
    file_ttl_minutes: int = 15
    job_timeout_seconds: int = 120
    rate_limit_per_minute: int = 20
    cors_origins: str = "http://localhost:3000"
    storage_dir: str = "/tmp/wade-convert"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
