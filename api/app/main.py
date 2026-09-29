from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .middleware import BatasUkuranMiddleware, RateLimitMiddleware

app = FastAPI(title="Wade Convert API", version="0.1.0")

app.add_middleware(
    BatasUkuranMiddleware,
    maks_mb=settings.max_upload_mb,
)
app.add_middleware(
    RateLimitMiddleware,
    batas=settings.rate_limit_per_minute,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
