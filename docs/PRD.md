# PRD: Wade Convert

Versi: 0.1 (draf) | Status: perlu ditinjau pemilik proyek

## 1. Latar belakang dan masalah
Layanan konversi file online populer (ILovePDF, ILoveIMG, dll.) sudah bagus, tetapi sering dikeluhkan: ada batas harian, iklan, kewajiban login, dan pengguna harus mengunggah dokumen sensitif (KTP, ijazah, kontrak) ke server pihak lain.

## 2. Tujuan
- Menyediakan toolkit konversi PDF dan gambar yang gratis dan mudah dipakai.
- Memproses sebanyak mungkin tool langsung di browser demi privasi.
- Menyediakan tool berat (OCR, PDF ke Markdown) lewat backend dengan penghapusan file otomatis.
- Menjadi proyek DevOps end-to-end: Docker, CI/CD, staging, monitoring.
- Open source (AGPL-3.0).

## 3. Non-tujuan (tidak dikerjakan dulu)
- Konversi audio/video
- Akun pengguna dan riwayat
- API publik berbayar
- Aplikasi mobile native

## 4. Target pengguna
Pelajar, pencari kerja, dan pegawai di Indonesia yang perlu mengolah dokumen dan foto dengan cepat (kompres, gabung, ubah format, penuhi syarat ukuran file pendaftaran).

## 5. Fitur dan tahap rilis
Keterangan: **[B]** = jalan di browser, **[S]** = butuh server.

| Tahap | Fitur |
|---|---|
| 1 | Gabung PDF [B], Pisah PDF [B], PDF ke JPG/PNG [B], JPG/PNG ke PDF [B], Kompres gambar [B], Konversi format gambar [B] |
| 2 | PDF ke teks/Markdown [S], OCR gambar dan PDF scan [S], Kompres PDF (termasuk target ukuran) [S] |
| 3 | Resize dengan preset (pas foto, CPNS, SNBP) [B], Hapus background [B/S], Tanda tangan PDF [B], Watermark [B], Rotate/urutkan halaman [B], Hapus metadata EXIF [B] |
| 4 | PDF ke Word [S], Office ke PDF [S], Ekstrak tabel ke CSV [S], Pipeline (rangkai langkah), Batch + unduh ZIP |

## 6. Persyaratan non-fungsional
- **Privasi**: tool [B] tidak mengunggah file. Tool [S] menghapus file otomatis (default 15 menit, lihat `FILE_TTL_MINUTES`). UI menandai jelas tool mana yang dikirim ke server.
- **Batas**: ukuran file maksimum 20 MB, PDF maksimum 100 halaman (dapat diatur lewat env).
- **Keamanan**: file pengguna dianggap tidak tepercaya; konversi berjalan di container terisolasi dengan batas waktu dan memori; rate limiting per IP.
- **Biaya**: Rp0 untuk tahap awal (hosting statis gratis + satu backend gratis).
- **Bahasa**: Indonesia dan Inggris.
- **Responsif**: nyaman dipakai di HP; mendukung dark mode.

## 7. Arsitektur ringkas
Frontend statis (Next.js) untuk semua tool [B]. Backend FastAPI untuk tool [S], dengan antrean job sederhana dan penyimpanan sementara. Semua dibungkus Docker. Komponen UI frontend memakai shadcn/ui (Tailwind v4) dengan ikon Lucide dan tema netral + satu aksen ([ADR 0004](adr/0004-ui-shadcn.md)). Detail: [architecture.md](architecture.md).

## 8. Rencana DevOps
| Lingkungan | Tujuan | Cara |
|---|---|---|
| Lokal | Pengembangan | `docker compose up` |
| Staging | Uji deploy otomatis, akses privat | Sementara lokal dari image GHCR (ADR 0005); VPS/HF Spaces menyusul |
| Produksi | Publik | Setelah tahap 2-3 stabil |

Tahapan: (1) Docker + Compose, (2) CI GitHub Actions (lint, test, build), (3) CD ke staging, (4) publik + monitoring/logging/backup, (5) opsional: Terraform, Prometheus + Grafana, Trivy, Kubernetes lokal.

## 9. Kriteria selesai per tahap
- **Tahap 1**: 6 tool berfungsi di browser; `docker compose up` berjalan bersih; CI hijau.
- **Tahap 2**: endpoint PDF ke Markdown dan OCR berfungsi untuk PDF teks dan scan; file terhapus otomatis; ada test dasar.
- **Tahap 3-4**: sesuai daftar fitur; ada staging dengan deploy otomatis.

## 10. Risiko dan pertanyaan terbuka
- RAM server gratis terbatas; hindari Marker/Docling di awal, mulai dari PyMuPDF4LLM + Tesseract.
- Syarat tier hosting gratis bisa berubah; verifikasi sebelum memilih.
- Lisensi: PyMuPDF dan Ghostscript berlisensi AGPL; cocok karena proyek ini AGPL-3.0.
- Kebijakan privasi dan syarat layanan wajib ada sebelum dibuka ke publik.
- Domain belum ditentukan.
