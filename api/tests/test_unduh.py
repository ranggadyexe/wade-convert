from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app
from app.penyimpanan import nama_aman, resolusi_hasil

client = TestClient(app)


def test_nama_aman_membersihkan_karakter_berbahaya():
    assert nama_aman("laporan final?.pdf") == "laporan final_.pdf"
    assert nama_aman("../etc/passwd") == "passwd"
    assert nama_aman("") == "hasil"


def test_resolusi_hasil_mengembalikan_jalur(tmp_path: Path):
    id_job = "a" * 32
    folder = tmp_path / id_job
    folder.mkdir()
    (folder / "hasil.md").write_text("x")
    assert resolusi_hasil(tmp_path, id_job, "hasil.md") == folder / "hasil.md"


def test_resolusi_hasil_menolak_traversal_dan_id_salah(tmp_path: Path):
    assert resolusi_hasil(tmp_path, "../../x", "a.txt") is None
    assert resolusi_hasil(tmp_path, "a" * 32, "../a.txt") is None
    assert resolusi_hasil(tmp_path, "b" * 32, "tidak-ada.md") is None


def test_unduh_tidak_ditemukan_404():
    respons = client.get(f"/api/v1/unduh/{'a' * 32}/tidak-ada.md")
    assert respons.status_code == 404
