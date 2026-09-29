import random
import shutil

import pymupdf
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

butuh_gs = pytest.mark.skipif(
    shutil.which("gs") is None, reason="ghostscript tidak terpasang"
)


def pdf_bergambar() -> bytes:
    acak = random.Random(42)

    sumber = pymupdf.open()
    halaman = sumber.new_page(width=595, height=842)
    for _ in range(2500):
        x = acak.uniform(0, 595)
        y = acak.uniform(0, 842)
        r = acak.uniform(2, 18)
        warna = (acak.random(), acak.random(), acak.random())
        halaman.draw_circle((x, y), r, color=warna, fill=warna)
    png = halaman.get_pixmap(dpi=120).tobytes("png")
    sumber.close()

    dokumen = pymupdf.open()
    hal = dokumen.new_page(width=595, height=842)
    hal.insert_image(pymupdf.Rect(0, 0, 595, 842), stream=png)
    data = dokumen.tobytes()
    dokumen.close()
    return data


@butuh_gs
def test_kompres_pdf_preset_screen_mengecil(penyimpanan_sementara):
    asal = pdf_bergambar()
    respons = client.post(
        "/api/v1/convert/compress-pdf",
        files={"berkas": ("foto.pdf", asal, "application/pdf")},
        params={"preset": "screen"},
    )
    assert respons.status_code == 200
    data = respons.json()
    assert data["preset_dipakai"] == "screen"
    assert data["ukuran_hasil"] < data["ukuran_asal"]

    unduh = client.get(data["url_unduh"])
    assert unduh.status_code == 200
    assert unduh.content.startswith(b"%PDF")


@butuh_gs
def test_kompres_pdf_target_kb_tercapai(penyimpanan_sementara):
    asal = pdf_bergambar()
    target = len(asal) // 1024 + 100
    respons = client.post(
        "/api/v1/convert/compress-pdf",
        files={"berkas": ("foto.pdf", asal, "application/pdf")},
        params={"target_kb": target},
    )
    assert respons.status_code == 200
    data = respons.json()
    assert data["target_tercapai"] is True
    assert data["ukuran_hasil"] <= target * 1024


@butuh_gs
def test_kompres_pdf_target_sangat_kecil_tidak_tercapai(penyimpanan_sementara):
    respons = client.post(
        "/api/v1/convert/compress-pdf",
        files={"berkas": ("foto.pdf", pdf_bergambar(), "application/pdf")},
        params={"target_kb": 1},
    )
    assert respons.status_code == 200
    data = respons.json()
    assert data["target_tercapai"] is False
    assert data["preset_dipakai"] == "screen"


def test_kompres_pdf_tipe_salah_ditolak_415(penyimpanan_sementara):
    respons = client.post(
        "/api/v1/convert/compress-pdf",
        files={"berkas": ("a.png", b"x", "image/png")},
    )
    assert respons.status_code == 415


def test_kompres_pdf_preset_tidak_dikenal_ditolak_422(penyimpanan_sementara):
    respons = client.post(
        "/api/v1/convert/compress-pdf",
        files={"berkas": ("a.pdf", b"%PDF-1.4", "application/pdf")},
        params={"preset": "ultra"},
    )
    assert respons.status_code == 422
