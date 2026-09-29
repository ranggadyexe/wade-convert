from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_origin_dari_env_diizinkan():
    respons = client.get("/health", headers={"Origin": "http://localhost:3000"})
    assert respons.status_code == 200
    assert respons.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_preflight_cors_berhasil():
    respons = client.options(
        "/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert respons.status_code == 200
    assert respons.headers.get("access-control-allow-origin") == "http://localhost:3000"
