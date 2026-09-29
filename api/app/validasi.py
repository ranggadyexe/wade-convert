from fastapi import HTTPException, UploadFile


def validasi_unggahan(
    unggahan: UploadFile,
    *,
    tipe_diizinkan: set[str],
    maks_mb: int,
) -> None:
    """Validasi tipe MIME dan ukuran file unggahan.

    Dipakai endpoint konversi di Fase 2. Ukuran hanya dicek jika
    Starlette sudah mengisinya (multipart selalu mengisi).
    """
    tipe = unggahan.content_type or ""
    if tipe not in tipe_diizinkan:
        raise HTTPException(
            status_code=415,
            detail=f"Tipe file tidak didukung: {tipe or 'tidak diketahui'}",
        )
    batas = maks_mb * 1024 * 1024
    if unggahan.size is not None and unggahan.size > batas:
        raise HTTPException(
            status_code=413,
            detail=f"Ukuran file melebihi {maks_mb} MB",
        )
