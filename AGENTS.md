# Instruksi untuk AI Agent

Kamu membantu membangun **Wade Convert**, toolkit konversi file online open source. Baca `docs/PRD.md`, `docs/architecture.md`, dan `docs/TASKS.md` sebelum mulai.

## Aturan kerja
1. Kerjakan **satu tugas** dari `docs/TASKS.md` per sesi, berurutan. Centang tugas yang selesai.
2. Jangan menambah fitur di luar PRD. Jika perlu, tanyakan atau catat di bagian "Risiko dan pertanyaan terbuka".
3. Commit kecil dengan Conventional Commits (lihat `CONTRIBUTING.md`). Jangan langsung ke `main`; pakai branch fitur.
4. Jangan pernah commit `.env` atau rahasia apa pun. Tambahkan variabel baru ke `.env.example`.
5. Setiap perubahan harus bisa dijalankan lewat `docker compose up --build`.
6. Tambahkan test untuk kode backend baru; jalankan lint dan test sebelum menyatakan selesai.
7. Keputusan arsitektur baru dicatat sebagai ADR di `docs/adr/`.

## Prinsip produk
- **Browser dulu**, server hanya untuk tool berat.
- File pengguna di server harus dihapus otomatis (TTL) dan diperlakukan sebagai tidak tepercaya (validasi tipe/ukuran, timeout, jalankan sebagai non-root).
- UI berbahasa Indonesia (dengan struktur i18n agar bisa menambah Inggris).
- Lisensi AGPL-3.0; jangan menambahkan dependensi dengan lisensi yang tidak kompatibel.

## Stack
- Web: Next.js (App Router) + TypeScript + Tailwind v4 + shadcn/ui + Lucide icons; pdf-lib, pdf.js, canvas/WASM
- API: FastAPI (Python 3.11+); PyMuPDF4LLM, OCRmyPDF/Tesseract, Ghostscript, ImageMagick
- Infra: Docker, Docker Compose, GitHub Actions

## Cara menjalankan
```bash
cp .env.example .env
docker compose up --build
```
