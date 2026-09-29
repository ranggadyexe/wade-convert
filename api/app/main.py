import asyncio
from contextlib import asynccontextmanager, suppress
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .middleware import BatasUkuranMiddleware, RateLimitMiddleware
from .penyimpanan import pembersih_periodik
from .routers import konversi, unduh


@asynccontextmanager
async def lifespan(app: FastAPI):
    tugas_pembersih = asyncio.create_task(
        pembersih_periodik(
            Path(settings.storage_dir),
            ttl_detik=settings.file_ttl_minutes * 60,
        )
    )
    yield
    tugas_pembersih.cancel()
    with suppress(asyncio.CancelledError):
        await tugas_pembersih


app = FastAPI(title="Wade Convert API", version="0.1.0", lifespan=lifespan)

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


app.include_router(konversi.router)
app.include_router(unduh.router)
