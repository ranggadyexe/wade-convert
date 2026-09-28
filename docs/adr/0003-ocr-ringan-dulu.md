# ADR 0003: Mulai dengan PyMuPDF4LLM + Tesseract, bukan Marker/Docling

- Status: Diterima
- Tanggal: 2026-09-28

## Konteks
Server gratis punya CPU/RAM terbatas. Marker dan Docling memakai model ML yang berat.

## Keputusan
Tahap 2 memakai PyMuPDF4LLM (PDF teks) dan OCRmyPDF/Tesseract (PDF scan). Marker/Docling dipertimbangkan sebagai opsi "kualitas tinggi" setelah ada sumber daya lebih.

## Konsekuensi
- Cepat dan ringan; kualitas tabel/rumus/layout kompleks lebih rendah.
- Antarmuka converter dibuat modular agar mesin bisa diganti tanpa mengubah API.
