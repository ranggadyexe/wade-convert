import assert from "node:assert/strict";
import { test } from "node:test";

import { saranAlat } from "./saran.ts";

test("saranAlat untuk PDF menyarankan alat PDF", () => {
  assert.deepEqual(saranAlat(["ktp.pdf"]), [
    "gabung-pdf",
    "pisah-pdf",
    "pdf-ke-gambar",
    "pdf-ke-markdown",
    "kompres-pdf",
    "ocr",
  ]);
});

test("saranAlat untuk gambar menyarankan alat gambar", () => {
  assert.deepEqual(saranAlat(["foto.JPG"]), [
    "kompres-gambar",
    "konversi-gambar",
    "gambar-ke-pdf",
    "resize-gambar",
    "hapus-exif",
    "ocr",
  ]);
});

test("saranAlat menggabungkan saran untuk berkas campuran", () => {
  assert.deepEqual(saranAlat(["a.pdf", "b.png"]), [
    "gabung-pdf",
    "pisah-pdf",
    "pdf-ke-gambar",
    "pdf-ke-markdown",
    "kompres-pdf",
    "ocr",
    "kompres-gambar",
    "konversi-gambar",
    "gambar-ke-pdf",
    "resize-gambar",
    "hapus-exif",
  ]);
});

test("saranAlat kosong untuk tipe yang tidak didukung", () => {
  assert.deepEqual(saranAlat(["dokumen.docx"]), []);
});
