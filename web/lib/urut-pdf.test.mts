import assert from "node:assert/strict";
import { test } from "node:test";

import { PDFDocument } from "pdf-lib";

import { namaHasilUrut, pindahItem, putar, susunPdf } from "./urut-pdf.ts";

test("putar menormalkan sudut ke kelipatan 90", () => {
  assert.equal(putar(0, 90), 90);
  assert.equal(putar(270, 90), 0);
  assert.equal(putar(0, 450), 90);
  assert.equal(putar(0, -90), 270);
});

test("pindahItem memindahkan elemen dan mengabaikan indeks tidak valid", () => {
  assert.deepEqual(pindahItem(["a", "b", "c"], 0, 2), ["b", "c", "a"]);
  assert.deepEqual(pindahItem(["a", "b", "c"], 2, 0), ["c", "a", "b"]);
  assert.deepEqual(pindahItem(["a", "b"], 5, 0), ["a", "b"]);
});

test("susunPdf mengubah urutan dan rotasi halaman", async () => {
  const sumber = await PDFDocument.create();
  sumber.addPage([100, 200]);
  sumber.addPage([200, 200]);
  sumber.addPage([300, 200]);
  const berkas = new File([new Uint8Array(await sumber.save())], "tiga.pdf", {
    type: "application/pdf",
  });

  const hasil = await susunPdf(berkas, [
    { asal: 2, rotasi: 90 },
    { asal: 0, rotasi: 0 },
    { asal: 1, rotasi: 180 },
  ]);

  const dokumen = await PDFDocument.load(await hasil.arrayBuffer());
  assert.equal(dokumen.getPageCount(), 3);
  assert.equal(dokumen.getPage(0).getWidth(), 300);
  assert.equal(dokumen.getPage(0).getRotation().angle, 90);
  assert.equal(dokumen.getPage(1).getWidth(), 100);
  assert.equal(dokumen.getPage(2).getRotation().angle, 180);
});

test("namaHasilUrut menambah akhiran", () => {
  assert.equal(namaHasilUrut("berkas final.pdf"), "berkas final-urut.pdf");
});
