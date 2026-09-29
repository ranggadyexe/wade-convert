import mimetypes
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from ..config import settings
from ..penyimpanan import resolusi_hasil

router = APIRouter(prefix="/api/v1", tags=["unduh"])


@router.get("/unduh/{id_job}/{nama}")
def unduh(id_job: str, nama: str) -> FileResponse:
    jalur = resolusi_hasil(Path(settings.storage_dir), id_job, nama)
    if jalur is None:
        raise HTTPException(
            status_code=404, detail="Hasil tidak ditemukan atau sudah kedaluwarsa"
        )
    tipe, _ = mimetypes.guess_type(nama)
    return FileResponse(
        jalur, media_type=tipe or "application/octet-stream", filename=nama
    )
