import assert from "node:assert/strict";
import { test } from "node:test";

import { PDFDocument } from "pdf-lib";

import { gabungPdf, namaHasilGabung } from "./gabung-pdf.ts";

async function pdfDenganHalaman(jumlah: number): Promise<File> {
  const dokumen = await PDFDocument.create();
  for (let i = 0; i < jumlah; i++) dokumen.addPage();
  const bytes = await dokumen.save();
  return new File([new Uint8Array(bytes)], `bagian-${jumlah}.pdf`, {
    type: "application/pdf",
  });
}

test("gabungPdf menyatukan halaman sesuai urutan", async () => {
  const hasil = await gabungPdf([
    await pdfDenganHalaman(2),
    await pdfDenganHalaman(3),
  ]);
  assert.equal(hasil.jumlahHalaman, 5);
  assert.equal(hasil.blob.type, "application/pdf");
  const dokumen = await PDFDocument.load(await hasil.blob.arrayBuffer());
  assert.equal(dokumen.getPageCount(), 5);
});

test("gabungPdf menolak melebihi batas halaman", async () => {
  await assert.rejects(
    gabungPdf([await pdfDenganHalaman(101)]),
    /Melebihi batas/,
  );
});

test("namaHasilGabung memakai nama file pertama", () => {
  assert.equal(namaHasilGabung("scan-ktp.pdf"), "scan-ktp-gabung.pdf");
  assert.equal(
    namaHasilGabung("laporan.final.PDF"),
    "laporan.final-gabung.pdf",
  );
});
