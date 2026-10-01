import assert from "node:assert/strict";
import { test } from "node:test";

import { PDFDocument } from "pdf-lib";

import {
  beriWatermark,
  hitungTempatWatermark,
  namaHasilWatermark,
  titikAsalTeks,
} from "./watermark-pdf.ts";

test("titikAsalTeks menggeser origin agar pusat teks tepat di titik pusat", () => {
  const titik = titikAsalTeks(100, 20, 45, 300, 400);
  assert.ok(Math.abs(titik.x - 271.7157) < 0.01);
  assert.ok(Math.abs(titik.y - 357.5736) < 0.01);
});

test("hitungTempatWatermark untuk tiga posisi", () => {
  const tengah = hitungTempatWatermark(600, 800, 100, 20, "tengah");
  assert.equal(tengah.rotasi, 45);
  assert.ok(Math.abs(tengah.x - 271.7157) < 0.5);
  assert.ok(Math.abs(tengah.y - 357.5736) < 0.5);

  assert.deepEqual(hitungTempatWatermark(600, 800, 100, 20, "atas"), {
    x: 250,
    y: 740,
    rotasi: 0,
  });
  assert.deepEqual(hitungTempatWatermark(600, 800, 100, 20, "bawah"), {
    x: 250,
    y: 40,
    rotasi: 0,
  });
});

test("beriWatermark menempel ke semua halaman", async () => {
  const sumber = await PDFDocument.create();
  sumber.addPage([595, 842]);
  sumber.addPage([595, 842]);
  const berkas = new File([new Uint8Array(await sumber.save())], "naskah.pdf", {
    type: "application/pdf",
  });

  const hasil = await beriWatermark(berkas, {
    teks: "RAHASIA",
    posisi: "tengah",
  });
  const dokumen = await PDFDocument.load(await hasil.arrayBuffer());
  assert.equal(dokumen.getPageCount(), 2);
});

test("beriWatermark menolak teks kosong dan mendukung nama hasil", async () => {
  const sumber = await PDFDocument.create();
  sumber.addPage([595, 842]);
  const berkas = new File([new Uint8Array(await sumber.save())], "a.pdf", {
    type: "application/pdf",
  });
  await assert.rejects(
    beriWatermark(berkas, { teks: "   ", posisi: "bawah" }),
    /tidak boleh kosong/,
  );
  assert.equal(namaHasilWatermark("a.pdf"), "a-watermark.pdf");
});
