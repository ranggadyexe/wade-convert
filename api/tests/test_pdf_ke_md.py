import pymupdf
import pytest
from fastapi.testclient import TestClient

from app.config import settings
from app.main import app

client = TestClient(app)


def pdf_ke_bytes(*, halaman: int = 1, teks: str = "Halo dunia") -> bytes:
    dokumen = pymupdf.open()
    for indeks in range(halaman):
        page = dokumen.new_page()
        if indeks == 0:
            page.insert_text((72, 72), teks)
    data = dokumen.tobytes()
    dokumen.close()
    return data


@pytest.fixture
def penyimpanan_sementara(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "storage_dir", str(tmp_path))
    return tmp_path


def test_pdf_ke_md_menghasilkan_markdown(penyimpanan_sementara):
    respons = client.post(
        "/api/v1/convert/pdf-to-md",
        files={"berkas": ("catatan.pdf", pdf_ke_bytes(), "application/pdf")},
    )
    assert respons.status_code == 200
    data = respons.json()
    assert data["jumlah_halaman"] == 1
    assert data["nama_hasil"] == "catatan.md"

    unduh = client.get(data["url_unduh"])
    assert unduh.status_code == 200
    assert "Halo dunia" in unduh.text


def test_tipe_bukan_pdf_ditolak_415(penyimpanan_sementara):
    respons = client.post(
        "/api/v1/convert/pdf-to-md",
        files={"berkas": ("a.txt", b"x", "text/plain")},
    )
    assert respons.status_code == 415


def test_pdf_rusak_ditolak_422(penyimpanan_sementara):
    respons = client.post(
        "/api/v1/convert/pdf-to-md",
        files={"berkas": ("rusak.pdf", b"bukan pdf", "application/pdf")},
    )
    assert respons.status_code == 422


def test_pdf_lebih_100_halaman_ditolak_413(penyimpanan_sementara):
    respons = client.post(
        "/api/v1/convert/pdf-to-md",
        files={"berkas": ("tebal.pdf", pdf_ke_bytes(halaman=101), "application/pdf")},
    )
    assert respons.status_code == 413
