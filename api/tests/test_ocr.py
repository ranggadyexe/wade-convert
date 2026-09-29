import shutil

import pymupdf
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

butuh_tesseract = pytest.mark.skipif(
    shutil.which("tesseract") is None, reason="tesseract tidak terpasang"
)


def gambar_png_berteks() -> bytes:
    dokumen = pymupdf.open()
    halaman = dokumen.new_page(width=600, height=200)
    halaman.insert_text((40, 120), "HALO DUNIA", fontsize=48)
    data = halaman.get_pixmap(dpi=150).tobytes("png")
    dokumen.close()
    return data


@butuh_tesseract
def test_ocr_png_menghasilkan_pdf_berteks(penyimpanan_sementara):
    respons = client.post(
        "/api/v1/convert/ocr",
        files={"berkas": ("scan.png", gambar_png_berteks(), "image/png")},
    )
    assert respons.status_code == 200
    data = respons.json()
    assert data["nama_hasil"] == "scan-ocr.pdf"
    assert data["jumlah_halaman"] == 1

    unduh = client.get(data["url_unduh"])
    assert unduh.status_code == 200
    dokumen = pymupdf.open(stream=unduh.content, filetype="pdf")
    teks = "".join(halaman.get_text() for halaman in dokumen).upper()
    dokumen.close()
    assert "HALO" in teks


def test_ocr_tipe_tidak_didukung_ditolak_415(penyimpanan_sementara):
    respons = client.post(
        "/api/v1/convert/ocr",
        files={"berkas": ("a.txt", b"x", "text/plain")},
    )
    assert respons.status_code == 415


def test_ocr_pdf_rusak_ditolak_422(penyimpanan_sementara):
    respons = client.post(
        "/api/v1/convert/ocr",
        files={"berkas": ("rusak.pdf", b"bukan pdf", "application/pdf")},
    )
    assert respons.status_code == 422
