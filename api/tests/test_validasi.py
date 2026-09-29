from io import BytesIO

import pytest
from fastapi import HTTPException, UploadFile
from starlette.datastructures import Headers

from app.validasi import validasi_unggahan


def buat_unggahan(nama: str, tipe: str, besar: int) -> UploadFile:
    return UploadFile(
        file=BytesIO(b"x" * besar),
        size=besar,
        filename=nama,
        headers=Headers({"content-type": tipe}),
    )


def test_tipe_dan_ukuran_valid_lolos():
    validasi_unggahan(
        buat_unggahan("ktp.pdf", "application/pdf", 10),
        tipe_diizinkan={"application/pdf"},
        maks_mb=20,
    )


def test_tipe_tidak_didukung_ditolak_415():
    with pytest.raises(HTTPException) as galat:
        validasi_unggahan(
            buat_unggahan("gambar.png", "image/png", 10),
            tipe_diizinkan={"application/pdf"},
            maks_mb=20,
        )
    assert galat.value.status_code == 415


def test_ukuran_berlebih_ditolak_413():
    with pytest.raises(HTTPException) as galat:
        validasi_unggahan(
            buat_unggahan("besar.pdf", "application/pdf", 21 * 1024 * 1024),
            tipe_diizinkan={"application/pdf"},
            maks_mb=20,
        )
    assert galat.value.status_code == 413
