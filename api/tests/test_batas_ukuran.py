from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.middleware import BatasUkuranMiddleware


def buat_klien(maks_mb: int) -> TestClient:
    app = FastAPI()
    app.add_middleware(BatasUkuranMiddleware, maks_mb=maks_mb)

    @app.post("/api/unggah")
    async def unggah() -> dict[str, bool]:
        return {"ok": True}

    return TestClient(app)


def test_permintaan_terlalu_besar_ditolak_413():
    klien = buat_klien(1)
    besar = b"x" * (2 * 1024 * 1024)
    respons = klien.post("/api/unggah", content=besar)
    assert respons.status_code == 413


def test_permintaan_kecil_lolos():
    klien = buat_klien(1)
    respons = klien.post("/api/unggah", content=b"x" * 10)
    assert respons.status_code == 200
