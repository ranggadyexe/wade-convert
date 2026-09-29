import asyncio
import os
import time
from io import BytesIO
from pathlib import Path

from fastapi import UploadFile
from starlette.datastructures import Headers

from app import penyimpanan


def test_buat_job_membuat_direktori(tmp_path: Path):
    id_job, jalur = penyimpanan.buat_job(tmp_path)
    assert jalur.exists()
    assert jalur.name == id_job


def test_bersihkan_kedaluwarsa_hanya_yang_lama(tmp_path: Path):
    lama = tmp_path / "lama"
    lama.mkdir()
    (lama / "berkas.txt").write_text("x")
    baru = tmp_path / "baru"
    baru.mkdir()
    waktu_lama = time.time() - 3600
    os.utime(lama, (waktu_lama, waktu_lama))

    jumlah = penyimpanan.bersihkan_kedaluwarsa(tmp_path, ttl_detik=900)

    assert jumlah == 1
    assert not lama.exists()
    assert baru.exists()


def test_bersihkan_akar_tidak_ada_mengembalikan_nol(tmp_path: Path):
    assert penyimpanan.bersihkan_kedaluwarsa(tmp_path / "hilang", 900) == 0


def test_pembersih_periodik_menghapus_yang_kedaluwarsa(tmp_path: Path):
    lama = tmp_path / "lama"
    lama.mkdir()
    waktu_lama = time.time() - 3600
    os.utime(lama, (waktu_lama, waktu_lama))

    async def jalankan() -> None:
        tugas = asyncio.create_task(
            penyimpanan.pembersih_periodik(tmp_path, ttl_detik=900, interval_detik=0.05)
        )
        await asyncio.sleep(0.15)
        tugas.cancel()
        try:
            await tugas
        except asyncio.CancelledError:
            pass

    asyncio.run(jalankan())
    assert not lama.exists()


def test_simpan_unggahan_menulis_semua_cuplikan(tmp_path: Path):
    unggahan = UploadFile(
        file=BytesIO(b"a" * 10),
        size=10,
        filename="a.txt",
        headers=Headers({"content-type": "text/plain"}),
    )
    tujuan = tmp_path / "out" / "a.txt"

    total = asyncio.run(penyimpanan.simpan_unggahan(unggahan, tujuan))

    assert total == 10
    assert tujuan.read_bytes() == b"a" * 10
