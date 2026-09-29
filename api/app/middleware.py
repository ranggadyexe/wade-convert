import time
from collections import deque

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse


class BatasUkuranMiddleware(BaseHTTPMiddleware):
    """Tolak permintaan yang Content-Length-nya melebihi batas (413)."""

    def __init__(self, app, *, maks_mb: int):
        super().__init__(app)
        self.maks_mb = maks_mb
        self.maks_byte = maks_mb * 1024 * 1024

    async def dispatch(self, request: Request, call_next):
        panjang = request.headers.get("content-length")
        if panjang is not None:
            try:
                besar = int(panjang)
            except ValueError:
                besar = None
            if besar is not None and besar > self.maks_byte:
                return JSONResponse(
                    status_code=413,
                    content={"detail": f"Ukuran permintaan melebihi {self.maks_mb} MB"},
                )
        return await call_next(request)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Batasi jumlah permintaan per IP dalam satu jendela waktu (429)."""

    def __init__(
        self,
        app,
        *,
        batas: int,
        jendela_detik: float = 60.0,
        kecuali: tuple[str, ...] = ("/health",),
    ):
        super().__init__(app)
        self.batas = batas
        self.jendela_detik = jendela_detik
        self.kecuali = kecuali
        self._catatan: dict[str, deque[float]] = {}

    async def dispatch(self, request: Request, call_next):
        if request.url.path in self.kecuali:
            return await call_next(request)
        ip = request.client.host if request.client else "tidak-diketahui"
        sekarang = time.monotonic()
        antre = self._catatan.setdefault(ip, deque())
        while antre and sekarang - antre[0] > self.jendela_detik:
            antre.popleft()
        if len(antre) >= self.batas:
            return JSONResponse(
                status_code=429,
                content={"detail": "Terlalu banyak permintaan. Coba lagi nanti."},
                headers={"Retry-After": str(int(self.jendela_detik))},
            )
        antre.append(sekarang)
        return await call_next(request)
