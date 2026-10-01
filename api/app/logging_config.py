import json
import logging
import sys
from datetime import datetime, timezone


class FormatJson(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        data: dict[str, object] = {
            "waktu": datetime.fromtimestamp(
                record.created, tz=timezone.utc
            ).isoformat(),
            "tingkat": record.levelname,
            "logger": record.name,
            "pesan": record.getMessage(),
        }
        if record.exc_info:
            data["pengecualian"] = self.formatException(record.exc_info)
        return json.dumps(data, ensure_ascii=False)


def konfigurasi_log(tingkat: str = "INFO") -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(FormatJson())

    akar = logging.getLogger()
    akar.handlers = [handler]
    akar.setLevel(tingkat)

    for nama in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        logger = logging.getLogger(nama)
        logger.handlers = [handler]
        logger.propagate = False
