import json
import logging
from io import StringIO

from app.logging_config import FormatJson, konfigurasi_log


def test_formatter_menghasilkan_json():
    aliran = StringIO()
    handler = logging.StreamHandler(aliran)
    handler.setFormatter(FormatJson())

    logger = logging.getLogger("uji")
    logger.handlers = [handler]
    logger.propagate = False
    logger.setLevel(logging.INFO)
    logger.info("halo %s", "dunia")

    data = json.loads(aliran.getvalue().strip())
    assert data["pesan"] == "halo dunia"
    assert data["tingkat"] == "INFO"
    assert data["logger"] == "uji"
    assert "waktu" in data


def test_konfigurasi_log_mengatur_handler_akar():
    konfigurasi_log("DEBUG")
    akar = logging.getLogger()
    assert akar.level == logging.DEBUG
    assert len(akar.handlers) == 1
    assert isinstance(akar.handlers[0].formatter, FormatJson)
