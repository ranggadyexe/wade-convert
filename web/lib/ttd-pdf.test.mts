import assert from "node:assert/strict";
import { test } from "node:test";

import { PDFDocument } from "pdf-lib";

import { hitungTempat, namaHasilTtd, tempelTandaTangan } from "./ttd-pdf.ts";

const PNG_1PX =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const DATA_URL = `data:image/png;base64,${PNG_1PX}`;

test("hitungTempat menempatkan tanda tangan sesuai posisi", () => {
  assert.deepEqual(hitungTempat(600, 800, 0.4, "kiri"), {
    x: 40,
    y: 40,
    lebar: 150,
    tinggi: 60,
  });
  assert.deepEqual(hitungTempat(600, 800, 0.4, "tengah"), {
    x: 225,
    y: 40,
    lebar: 150,
    tinggi: 60,
  });
  assert.deepEqual(hitungTempat(600, 800, 0.4, "kanan"), {
    x: 410,
    y: 40,
    lebar: 150,
    tinggi: 60,
  });
});

test("tempelTandaTangan menempel gambar ke halaman yang benar", async () => {
  const sumber = await PDFDocument.create();
  sumber.addPage([595, 842]);
  sumber.addPage([595, 842]);
  const berkas = new File([new Uint8Array(await sumber.save())], "naskah.pdf", {
    type: "application/pdf",
  });

  const hasil = await tempelTandaTangan(berkas, DATA_URL, {
    halaman: 2,
    posisi: "tengah",
  });

  const dokumen = await PDFDocument.load(await hasil.arrayBuffer());
  assert.equal(dokumen.getPageCount(), 2);
});

test("tempelTandaTangan menolak halaman di luar rentang", async () => {
  const sumber = await PDFDocument.create();
  sumber.addPage([595, 842]);
  const berkas = new File([new Uint8Array(await sumber.save())], "satu.pdf", {
    type: "application/pdf",
  });

  await assert.rejects(
    tempelTandaTangan(berkas, DATA_URL, { halaman: 5, posisi: "kiri" }),
    /Halaman harus/,
  );
});

test("namaHasilTtd menambah akhiran", () => {
  assert.equal(namaHasilTtd("kontrak.pdf"), "kontrak-ttd.pdf");
});
