# ADR 0005: Staging lokal dulu, deploy dari image GHCR

- Status: Diterima
- Tanggal: 2026-09-30

## Konteks
PRD merencanakan staging privat dengan CD otomatis (Hugging Face Spaces atau VPS). Pemilik proyek belum memiliki server/VPS dan untuk sementara ingin tetap bisa memakai versi terbaru hasil `main`.

## Keputusan
"Staging" tahap ini dijalankan lokal memakai image dari GHCR lewat `docker-compose.deploy.yml` + skrip `deploy.ps1` (tarik image terbaru, lalu jalankan ulang). CD otomatis penuh dan pindah ke VPS/HF Spaces ditunda sampai server tersedia; karena image sudah dipublikasikan ke GHCR, jalur pindah nanti hanya mengganti target deploy (mis. SSH ke VPS), bukan proses build.

## Konsekuensi
- Gratis dan tanpa eksposur internet: hanya bisa diakses dari jaringan lokal.
- Deploy satu perintah manual dan PC harus menyala (belum otomatis).
- Versi yang dites sama dengan yang dipublikasikan (image GHCR), jadi perilaku di server nanti konsisten.
