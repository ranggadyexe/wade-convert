import asyncio
import shutil
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


@router.post("/pdf-to-md")
async def pdf_ke_md(berkas: Annotated[UploadFile, File()]) -> dict[str, object]:
    validasi_unggahan(
        berkas, tipe_diizinkan={"application/pdf"}, maks_mb=settings.max_upload_mb
    )
    id_job, jalur_job = buat_job(Path(settings.storage_dir))
    masuk = jalur_job / "masuk.pdf"
    await simpan_unggahan(berkas, masuk)

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
