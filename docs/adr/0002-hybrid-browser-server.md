# ADR 0002: Arsitektur hybrid (browser + server)

- Status: Diterima
- Tanggal: 2026-09-28

## Konteks
Budget hosting Rp0. Privasi file pengguna jadi nilai jual. Sebagian tool (OCR, PDF ke Markdown) terlalu berat untuk browser.

## Keputusan
Tool ringan berjalan di browser; tool berat berjalan di satu backend FastAPI dengan penghapusan file otomatis.

## Konsekuensi
- Biaya server minimal dan privasi kuat untuk mayoritas tool.
- Frontend lebih kompleks (WASM/JS library).
- Backend harus dijaga dari abuse (rate limit, batas ukuran, isolasi).
