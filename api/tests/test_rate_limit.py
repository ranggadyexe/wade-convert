from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.middleware import RateLimitMiddleware


def buat_klien(batas: int) -> TestClient:
    app = FastAPI()
    app.add_middleware(RateLimitMiddleware, batas=batas, jendela_detik=60)

    @app.get("/api/tes")
    def tes() -> dict[str, bool]:
        return {"ok": True}

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return TestClient(app)


def test_batas_terlampaui_mengembalikan_429():
    klien = buat_klien(3)
    for _ in range(3):
        assert klien.get("/api/tes").status_code == 200
    respons = klien.get("/api/tes")
    assert respons.status_code == 429
    assert respons.headers.get("retry-after")


def test_health_dikecualikan_dari_rate_limit():
    klien = buat_klien(1)
    assert klien.get("/api/tes").status_code == 200
    for _ in range(5):
        assert klien.get("/health").status_code == 200
