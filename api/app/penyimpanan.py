import asyncio
import re
import shutil
import time
import uuid
from pathlib import Path

from fastapi import UploadFile

UKURAN_CUPLIKAN = 1024 * 1024
INTERVAL_PEMBERSIH_DETIK = 60.0
POLA_ID_JOB = re.compile(r"^[0-9a-f]{32}$")


def nama_aman(nama: str) -> str:
    bersih = re.sub(r"[^\w\-. ]", "_", Path(nama).name).strip()
    return bersih or "hasil"


def resolusi_hasil(akar: Path, id_job: str, nama: str) -> Path | None:
    if not POLA_ID_JOB.fullmatch(id_job):
        return None
    if nama != Path(nama).name or ".." in nama:
        return None
    jalur = akar / id_job / nama
    return jalur if jalur.is_file() else None


def buat_id_job() -> str:
    return uuid.uuid4().hex


def buat_job(akar: Path) -> tuple[str, Path]:
    id_job = buat_id_job()
    jalur = akar / id_job
    jalur.mkdir(parents=True, exist_ok=True)
    return id_job, jalur


async def simpan_unggahan(unggahan: UploadFile, tujuan: Path) -> int:
    tujuan.parent.mkdir(parents=True, exist_ok=True)
    total = 0
    with tujuan.open("wb") as berkas:
        while cuplikan := await unggahan.read(UKURAN_CUPLIKAN):
            berkas.write(cuplikan)
            total += len(cuplikan)
    return total


def simpan_hasil(data: bytes, tujuan: Path) -> None:
    tujuan.parent.mkdir(parents=True, exist_ok=True)
    tujuan.write_bytes(data)


def bersihkan_kedaluwarsa(
    akar: Path,
    ttl_detik: float,
    *,
    sekarang: float | None = None,
) -> int:
    """Hapus direktori job yang mtime-nya lebih tua dari TTL. Kembalikan jumlah."""
    if not akar.exists():
        return 0
    batas = (sekarang if sekarang is not None else time.time()) - ttl_detik
    jumlah = 0
    for item in akar.iterdir():
        if item.is_dir() and item.stat().st_mtime < batas:
            shutil.rmtree(item, ignore_errors=True)
            jumlah += 1
    return jumlah


async def pembersih_periodik(
    akar: Path,
    ttl_detik: float,
    interval_detik: float = INTERVAL_PEMBERSIH_DETIK,
) -> None:
    while True:
        bersihkan_kedaluwarsa(akar, ttl_detik)
        await asyncio.sleep(interval_detik)
