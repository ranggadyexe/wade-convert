# Backlog Tugas

Centang saat selesai. Kerjakan berurutan dari atas.

## Fase 0: Fondasi
- [x] Inisialisasi git, commit pertama (`chore: initial project scaffold`)
- [x] Push ke GitHub, atur branch protection untuk `main`
- [x] Verifikasi `docker compose up --build` menjalankan API dan `GET /health` mengembalikan `{"status":"ok"}`
- [x] Pasang pre-commit (ruff, prettier)

## Fase 1: Frontend + tool browser (Tahap 1 PRD)
- [x] Inisialisasi Next.js + TypeScript + Tailwind v4 di `web/` (App Router)
- [x] Setup shadcn/ui + tema warna (lihat ADR 0004), ikon Lucide
- [x] Layout dasar: header, beranda dengan kartu daftar tool, footer, dark mode
- [x] Komponen upload reusable (drag and drop, daftar file, progres, unduh)
- [x] Tool: Kompres gambar (canvas), jadikan template pola tool
- [x] Tool: Konversi format gambar (JPG/PNG/WebP)
- [x] Tool: Gabung PDF (pdf-lib)
- [x] Tool: Pisah PDF (pdf-lib)
- [x] Tool: PDF ke JPG/PNG (pdf.js)
- [x] Tool: JPG/PNG ke PDF
- [x] Aktifkan servis `web` di `docker-compose.yml` + Dockerfile web
- [x] Tambah job lint/build web di CI

## Fase 1.5: Redesain landing page
- [x] Redesain Header: tambah nav "Alat" (scroll ke grid tools) + ikon GitHub
- [x] Redesain Hero: judul besar + deskripsi + ilustrasi kecil bergaya
      CloudConvert (ikon file dengan panah "TO", lihat referensi terlampir)
- [x] Tambah card "pilih file" besar di tengah sebagai CTA utama, di bawah hero
- [x] Reframe grid tools jadi section "Alat yang Didukung"
- [x] Tambah section "Keamanan Data" (3 poin: diproses di browser,
      auto-hapus file di server, tanpa jual data) pakai Card shadcn + ikon Lucide
- [x] Tambah section "Kualitas Konversi" (3 poin: mesin open-source
      terpilih per tipe file, kontrol kompresi, hasil akurat)
- [x] Update Footer: "© 2026 Rangga Dewa Yudhistira", "Made in Cibubur,
      Indonesia", link "Contact Us"

## Fase 2: Backend tool berat (Tahap 2 PRD)
- [x] Middleware: validasi ukuran/tipe file, rate limit, CORS dari env
- [x] Penyimpanan sementara + pembersih TTL otomatis
- [x] Endpoint PDF ke teks/Markdown (PyMuPDF4LLM)
- [x] Endpoint OCR (OCRmyPDF/Tesseract, bahasa `ind`+`eng`)
- [x] Endpoint kompres PDF (Ghostscript), termasuk target ukuran
- [x] Test untuk tiap endpoint (pytest) + file contoh kecil
- [x] Halaman web untuk tiap tool server, dengan label "diproses di server"

## Fase 3: DevOps
- [x] CI: lint, test, build image (GitHub Actions) dengan cache
- [x] Publikasi image ke GHCR
- [ ] Staging privat + CD otomatis dari `main`
      (ditunda sampai ada VPS; sementara lokal dari GHCR - lihat ADR 0005)
- [x] Deploy lokal dari image GHCR (`deploy.ps1`)
- [x] Healthcheck, log terstruktur
- [x] Scan image dengan Trivy di CI
- [x] Draf kebijakan privasi dan syarat layanan

## Fase 4: Publik dan lanjutan
- [ ] Domain, HTTPS, monitoring (Prometheus + Grafana), backup konfigurasi
      (ditunda sampai ada VPS/domain)
- [x] Tool: Resize dengan preset (pas foto, CPNS, SNBP)
- [x] Tool: Hapus metadata EXIF
- [x] Tool: Rotate/urutkan halaman PDF
- [x] Tool: Tanda tangan PDF
- [x] Tool: Watermark PDF
- [ ] Tool: Hapus background
- [ ] Tool tahap 4: PDF ke Word, Office ke PDF, ekstrak tabel CSV
- [ ] Pipeline (rangkai langkah) + batch + unduh ZIP
- [ ] Opsional: Terraform, Kubernetes lokal (kind/minikube)
