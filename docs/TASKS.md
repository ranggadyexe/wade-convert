# Backlog Tugas

Centang saat selesai. Kerjakan berurutan dari atas.

## Fase 0: Fondasi
- [x] Inisialisasi git, commit pertama (`chore: initial project scaffold`)
- [x] Push ke GitHub, atur branch protection untuk `main`
- [x] Verifikasi `docker compose up --build` menjalankan API dan `GET /health` mengembalikan `{"status":"ok"}`
- [x] Pasang pre-commit (ruff, prettier)

## Fase 1: Frontend + tool browser (Tahap 1 PRD)
- [ ] Inisialisasi Next.js + TypeScript + Tailwind di `web/` (App Router)
- [ ] Layout dasar: header, beranda dengan kartu daftar tool, footer, dark mode
- [ ] Komponen upload reusable (drag and drop, daftar file, progres, unduh)
- [ ] Tool: Kompres gambar (canvas), jadikan template pola tool
- [ ] Tool: Konversi format gambar (JPG/PNG/WebP)
- [ ] Tool: Gabung PDF (pdf-lib)
- [ ] Tool: Pisah PDF (pdf-lib)
- [ ] Tool: PDF ke JPG/PNG (pdf.js)
- [ ] Tool: JPG/PNG ke PDF
- [ ] Aktifkan servis `web` di `docker-compose.yml` + Dockerfile web
- [ ] Tambah job lint/build web di CI

## Fase 2: Backend tool berat (Tahap 2 PRD)
- [ ] Middleware: validasi ukuran/tipe file, rate limit, CORS dari env
- [ ] Penyimpanan sementara + pembersih TTL otomatis
- [ ] Endpoint PDF ke teks/Markdown (PyMuPDF4LLM)
- [ ] Endpoint OCR (OCRmyPDF/Tesseract, bahasa `ind`+`eng`)
- [ ] Endpoint kompres PDF (Ghostscript), termasuk target ukuran
- [ ] Test untuk tiap endpoint (pytest) + file contoh kecil
- [ ] Halaman web untuk tiap tool server, dengan label "diproses di server"

## Fase 3: DevOps
- [ ] CI: lint, test, build image (GitHub Actions) dengan cache
- [ ] Publikasi image ke GHCR
- [ ] Staging privat + CD otomatis dari `main`
- [ ] Healthcheck, log terstruktur
- [ ] Scan image dengan Trivy di CI
- [ ] Draf kebijakan privasi dan syarat layanan

## Fase 4: Publik dan lanjutan
- [ ] Domain, HTTPS, monitoring (Prometheus + Grafana), backup konfigurasi
- [ ] Tool tahap 3 dan 4 sesuai PRD
- [ ] Opsional: Terraform, Kubernetes lokal (kind/minikube)
