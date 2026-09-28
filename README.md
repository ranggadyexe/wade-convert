# Wade Convert

Toolkit konversi file online, open source, gratis, dan mengutamakan privasi. Terinspirasi ILovePDF / ILoveIMG, dengan fokus:

- **Privasi**: tool ringan diproses langsung di browser, file tidak diunggah.
- **Tanpa iklan, tanpa login, tanpa batas berlebihan.**
- **Ramah pengguna Indonesia**: UI Bahasa Indonesia dan preset ukuran dokumen (CPNS, SNBP, dll.).

Status: **tahap perencanaan** (lihat [docs/PRD.md](docs/PRD.md)).

## Menjalankan secara lokal

Prasyarat: Docker + Docker Compose.

```bash
cp .env.example .env
docker compose up --build
```

- API: http://localhost:8000 (dokumentasi Swagger di `/docs`)
- Web: http://localhost:3000 (aktif setelah folder `web/` diinisialisasi, lihat `docs/TASKS.md`)

## Struktur repo

```
.
├── web/          # frontend (Next.js + Tailwind)
├── api/          # backend FastAPI (tool berat: OCR, PDF ke Markdown, dll.)
├── docs/         # PRD, arsitektur, ADR, backlog
├── .github/      # CI (GitHub Actions)
└── docker-compose.yml
```

## Dokumentasi

- [PRD](docs/PRD.md)
- [Arsitektur](docs/architecture.md)
- [Backlog tugas](docs/TASKS.md)
- [Keputusan arsitektur (ADR)](docs/adr/)
- [Panduan kontribusi](CONTRIBUTING.md)
- [Instruksi untuk AI agent](AGENTS.md)

## Lisensi

[AGPL-3.0](LICENSE). Jika kamu menjalankan versi modifikasi sebagai layanan publik, kamu wajib membuka kode sumbernya.
