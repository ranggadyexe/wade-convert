# Panduan Kontribusi

## Alur Git
- `main` selalu dalam keadaan bisa dijalankan.
- Kerjakan tiap fitur di branch terpisah: `feat/nama-fitur`, `fix/nama-bug`, `docs/nama-dokumen`.
- Gabungkan ke `main` lewat Pull Request. CI harus hijau.

## Pesan commit (Conventional Commits)
```
feat: tambah tool gabung PDF
fix: perbaiki error saat file HEIC kosong
docs: perbarui PRD
chore: perbarui dependensi
ci: tambah job lint
```

## Standar kode
- Frontend: ESLint + Prettier
- Backend: Ruff (lint + format), pytest untuk test
- Jalankan lint dan test sebelum commit.

## Keputusan penting
Catat keputusan arsitektur baru sebagai ADR di `docs/adr/` (salin format dari ADR yang sudah ada).
