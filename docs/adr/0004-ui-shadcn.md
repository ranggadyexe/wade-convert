# ADR 0004: Memakai shadcn/ui untuk komponen UI

- Status: Diterima
- Tanggal: 2026-09-29

## Konteks
Butuh komponen UI yang konsisten, tidak terasa generik/template, dan cepat dikerjakan untuk level developer menengah.

## Keputusan
Pakai shadcn/ui (berbasis Radix + Tailwind v4) sebagai basis komponen, dengan ikon dari Lucide. Tema warna: netral (base color neutral/zinc) + satu warna aksen, radius kecil-sedang. Tema diatur lewat CSS variable di `app/globals.css`, dihasilkan dari https://ui.shadcn.com/themes.

## Konsekuensi
- Komponen di-generate ke dalam repo (bukan npm package), jadi mudah dikustom tapi juga nambah kode di repo.
- Perlu Tailwind v4.
- Ganti tema di masa depan cukup ganti CSS variable, tidak perlu ubah komponen satu-satu.
