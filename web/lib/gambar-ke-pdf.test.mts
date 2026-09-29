import assert from "node:assert/strict";
import { test } from "node:test";

import { PDFDocument } from "pdf-lib";

import { gambarKePdf, namaHasilGambarKePdf } from "./gambar-ke-pdf.ts";

const PNG_1PX =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function berkasPng(nama: string): File {
  const bytes = new Uint8Array(Buffer.from(PNG_1PX, "base64"));
  return new File([bytes], nama, { type: "image/png" });
}

test("gambarKePdf membuat satu halaman A4 per gambar", async () => {
  const hasil = await gambarKePdf([berkasPng("a.png"), berkasPng("b.png")]);
  assert.equal(hasil.jumlahHalaman, 2);
  assert.equal(hasil.blob.type, "application/pdf");
  const dokumen = await PDFDocument.load(await hasil.blob.arrayBuffer());
  assert.equal(dokumen.getPageCount(), 2);
  const ukuran = dokumen.getPage(0).getSize();
  assert.ok(Math.abs(ukuran.width - 595.28) < 0.1);
  assert.ok(Math.abs(ukuran.height - 841.89) < 0.1);
});

test("gambarKePdf menolak melebihi batas halaman", async () => {
  const banyak = Array.from({ length: 101 }, (_, indeks) =>
    berkasPng(`h${indeks}.png`),
  );
  await assert.rejects(gambarKePdf(banyak), /Melebihi batas/);
});

test("namaHasilGambarKePdf memakai nama file pertama", () => {
  assert.equal(namaHasilGambarKePdf("foto.jpg"), "foto.pdf");
  assert.equal(namaHasilGambarKePdf("pindai.KTP.PNG"), "pindai.KTP.pdf");
});
