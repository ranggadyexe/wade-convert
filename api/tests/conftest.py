import os

import pytest

# Harus di-set sebelum app.config diimpor supaya middleware memakai nilai ini.
os.environ["RATE_LIMIT_PER_MINUTE"] = "10000"

from app.config import settings


@pytest.fixture
def penyimpanan_sementara(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "storage_dir", str(tmp_path))
    return tmp_path
