import asyncio
import shutil
import subprocess
from pathlib import Path
from typing import Annotated

import ocrmypdf
import pymupdf
import pymupdf4llm
from fastapi import APIRouter, File, HTTPException, UploadFile

from ..config import settings
from ..penyimpanan import buat_job, nama_aman, simpan_hasil, simpan_unggahan
from ..validasi import validasi_unggahan

router = APIRouter(prefix="/api/v1/convert", tags=["konversi"])

TIPE_OCR = {"application/pdf", "image/png", "image/jpeg"}
PRESET_GS = ("prepress", "printer", "ebook", "screen")
PRESET_TARGET = ("printer", "ebook", "screen")


def periksa_halaman_pdf(masuk: Path, jalur_job: Path) -> int:
    try:
        with pymupdf.open(masuk) as dokumen:
            jumlah_halaman = dokumen.page_count
    except pymupdf.FileDataError as galat:
        shutil.rmtree(jalur_job, ignore_errors=True)
        raise HTTPException(
            status_code=422, detail="PDF tidak bisa dibaca atau rusak"
        ) from galat
    if jumlah_halaman > settings.max_pdf_pages:
        shutil.rmtree(jalur_job, ignore_errors=True)
        raise HTTPException(
            status_code=413,
            detail=f"PDF melebihi {settings.max_pdf_pages} halaman",
        )
    return jumlah_halaman


PRESET_GS = ("prepress", "printer", "ebook", "screen")
PRESET_TARGET = ("printer", "ebook", "screen")


@router.post("/pdf-to-md")
async def pdf_ke_md(berkas: Annotated[UploadFile, File()]) -> dict[str, object]:
    validasi_unggahan(
        berkas, tipe_diizinkan={"application/pdf"}, maks_mb=settings.max_upload_mb
    )
    id_job, jalur_job = buat_job(Path(settings.storage_dir))
    masuk = jalur_job / "masuk.pdf"
    await simpan_unggahan(berkas, masuk)

    jumlah_halaman = periksa_halaman_pdf(masuk, jalur_job)

    try:
        markdown: str = await asyncio.wait_for(
            asyncio.to_thread(pymupdf4llm.to_markdown, str(masuk)),
            timeout=settings.job_timeout_seconds,
        )
    except TimeoutError as galat:
        shutil.rmtree(jalur_job, ignore_errors=True)
        raise HTTPException(
            status_code=504, detail="Proses melebihi batas waktu"
        ) from galat

    nama_hasil = f"{nama_aman(Path(berkas.filename or 'hasil').stem)}.md"
    simpan_hasil(markdown.encode("utf-8"), jalur_job / nama_hasil)
    return {
        "id_job": id_job,
        "nama_hasil": nama_hasil,
        "jumlah_halaman": jumlah_halaman,
        "url_unduh": f"/api/v1/unduh/{id_job}/{nama_hasil}",
    }


def jalankan_ocr(masuk: Path, keluar: Path, bahasa: str) -> None:
    ocrmypdf.ocr(
        str(masuk),
        str(keluar),
        language=bahasa,
        skip_text=True,
        optimize=0,
        jobs=1,
        progress_bar=False,
    )


@router.post("/ocr")
async def ocr(
    berkas: Annotated[UploadFile, File()],
    bahasa: str = "ind+eng",
) -> dict[str, object]:
    validasi_unggahan(berkas, tipe_diizinkan=TIPE_OCR, maks_mb=settings.max_upload_mb)
    id_job, jalur_job = buat_job(Path(settings.storage_dir))
    asal = nama_aman(berkas.filename or "masuk")
    bawaan = ".pdf" if berkas.content_type == "application/pdf" else ".png"
    masuk = jalur_job / f"masuk{Path(asal).suffix or bawaan}"
    await simpan_unggahan(berkas, masuk)

    jumlah_halaman = 0
    if berkas.content_type == "application/pdf":
        jumlah_halaman = periksa_halaman_pdf(masuk, jalur_job)

    nama_hasil = f"{nama_aman(Path(asal).stem)}-ocr.pdf"
    keluar = jalur_job / nama_hasil
    try:
        await asyncio.wait_for(
            asyncio.to_thread(jalankan_ocr, masuk, keluar, bahasa),
            timeout=settings.job_timeout_seconds,
        )
    except TimeoutError as galat:
        shutil.rmtree(jalur_job, ignore_errors=True)
        raise HTTPException(
            status_code=504, detail="Proses melebihi batas waktu"
        ) from galat
    except ocrmypdf.exceptions.ExitCodeException as galat:
        shutil.rmtree(jalur_job, ignore_errors=True)
        raise HTTPException(
            status_code=422,
            detail="OCR gagal dijalankan (file rusak atau tidak didukung)",
        ) from galat

    with pymupdf.open(keluar) as dokumen:
        jumlah_halaman = dokumen.page_count
    return {
        "id_job": id_job,
        "nama_hasil": nama_hasil,
        "jumlah_halaman": jumlah_halaman,
        "url_unduh": f"/api/v1/unduh/{id_job}/{nama_hasil}",
    }


def jalankan_gs(masuk: Path, keluar: Path, preset: str) -> None:
    subprocess.run(
        [
            "gs",
            "-sDEVICE=pdfwrite",
            "-dCompatibilityLevel=1.7",
            f"-dPDFSETTINGS=/{preset}",
            "-dNOPAUSE",
            "-dQUIET",
            "-dBATCH",
            f"-sOutputFile={keluar}",
            str(masuk),
        ],
        check=True,
        capture_output=True,
    )


@router.post("/compress-pdf")
async def kompres_pdf(
    berkas: Annotated[UploadFile, File()],
    preset: str = "ebook",
    target_kb: int | None = None,
) -> dict[str, object]:
    validasi_unggahan(
        berkas, tipe_diizinkan={"application/pdf"}, maks_mb=settings.max_upload_mb
    )
    if preset not in PRESET_GS:
        raise HTTPException(
            status_code=422,
            detail=f"Preset harus salah satu dari: {', '.join(PRESET_GS)}",
        )
    if target_kb is not None and target_kb <= 0:
        raise HTTPException(status_code=422, detail="target_kb harus positif")

    id_job, jalur_job = buat_job(Path(settings.storage_dir))
    masuk = jalur_job / "masuk.pdf"
    await simpan_unggahan(berkas, masuk)
    periksa_halaman_pdf(masuk, jalur_job)
    ukuran_asal = masuk.stat().st_size

    urutan = PRESET_TARGET if target_kb is not None else (preset,)
    terbaik: tuple[Path, str, int] | None = None
    try:
        for kandidat in urutan:
            keluaran = jalur_job / f"keluaran-{kandidat}.pdf"
            await asyncio.wait_for(
                asyncio.to_thread(jalankan_gs, masuk, keluaran, kandidat),
                timeout=settings.job_timeout_seconds,
            )
            ukuran = keluaran.stat().st_size
            if terbaik is None or ukuran < terbaik[2]:
                terbaik = (keluaran, kandidat, ukuran)
            if target_kb is not None and ukuran <= target_kb * 1024:
                break
    except TimeoutError as galat:
        shutil.rmtree(jalur_job, ignore_errors=True)
        raise HTTPException(
            status_code=504, detail="Proses melebihi batas waktu"
        ) from galat
    except subprocess.CalledProcessError as galat:
        shutil.rmtree(jalur_job, ignore_errors=True)
        raise HTTPException(
            status_code=422, detail="Gagal mengompres PDF dengan Ghostscript"
        ) from galat

    if terbaik is None:
        shutil.rmtree(jalur_job, ignore_errors=True)
        raise HTTPException(status_code=422, detail="Tidak ada hasil kompresi")

    jalur_terbaik, preset_dipakai, ukuran_hasil = terbaik
    nama_hasil = f"{nama_aman(Path(berkas.filename or 'hasil').stem)}-kompres.pdf"
    for berkas_lama in jalur_job.glob("keluaran-*.pdf"):
        if berkas_lama != jalur_terbaik:
            berkas_lama.unlink(missing_ok=True)
    jalur_terbaik.rename(jalur_job / nama_hasil)
    return {
        "id_job": id_job,
        "nama_hasil": nama_hasil,
        "preset_dipakai": preset_dipakai,
        "ukuran_asal": ukuran_asal,
        "ukuran_hasil": ukuran_hasil,
        "target_tercapai": (
            None if target_kb is None else ukuran_hasil <= target_kb * 1024
        ),
        "url_unduh": f"/api/v1/unduh/{id_job}/{nama_hasil}",
    }
