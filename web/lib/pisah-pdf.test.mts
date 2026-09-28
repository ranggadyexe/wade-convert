import assert from "node:assert/strict";
import { test } from "node:test";

import { PDFDocument } from "pdf-lib";

import { namaHasilPisah, parseRentang, pisahPdf } from "./pisah-pdf.ts";

test("parseRentang menerjemahkan rentang dan daftar", () => {
  assert.deepEqual(parseRentang("1-3, 5", 10), [0, 1, 2, 4]);
  assert.deepEqual(parseRentang("7", 10), [6]);
  assert.deepEqual(parseRentang("2-2", 10), [1]);
});

test("parseRentang menolak input tidak valid", () => {
  assert.throws(() => parseRentang("", 10), /kosong/);
  assert.throws(() => parseRentang("0", 10), /mulai dari 1/);
  assert.throws(() => parseRentang("5-2", 10), /terbalik/);
  assert.throws(() => parseRentang("12", 10), /melebihi/);
  assert.throws(() => parseRentang("a-b", 10), /tidak valid/);
});

test("pisahPdf mengambil halaman terpilih", async () => {
  const sumber = await PDFDocument.create();
  for (let i = 0; i < 5; i++) sumber.addPage();
  const berkas = new File(
    [new Uint8Array(await sumber.save())],
    "dokumen.pdf",
    {
      type: "application/pdf",
    },
  );
  const hasil = await pisahPdf(berkas, parseRentang("1,3,5", 5));
  assert.equal(hasil.jumlahHalaman, 3);
  const dokumen = await PDFDocument.load(await hasil.blob.arrayBuffer());
  assert.equal(dokumen.getPageCount(), 3);
});

test("namaHasilPisah menambah akhiran -pisah", () => {
  assert.equal(namaHasilPisah("berkas.pdf"), "berkas-pisah.pdf");
});
