import assert from "node:assert/strict";
import { test } from "node:test";

import { buatItem, formatUkuran, validasiBerkas } from "./berkas.ts";

test("formatUkuran menampilkan B, KB, dan MB", () => {
  assert.equal(formatUkuran(512), "512 B");
  assert.equal(formatUkuran(1024), "1 KB");
  assert.equal(formatUkuran(1536), "1,5 KB");
  assert.equal(formatUkuran(20 * 1024 * 1024), "20 MB");
});

test("validasiBerkas memeriksa ukuran dan ekstensi", () => {
  const pdf = { name: "ktp.pdf", size: 1024, type: "application/pdf" };
  assert.equal(validasiBerkas(pdf, { maksMB: 20, terima: [".pdf"] }), null);
  assert.match(
    validasiBerkas({ ...pdf, size: 21 * 1024 * 1024 }, { maksMB: 20 }) ?? "",
    /melebihi batas/i,
  );
  assert.match(
    validasiBerkas(pdf, { terima: [".jpg"] }) ?? "",
    /tidak didukung/i,
  );
});

test("buatItem memakai status awal menunggu", () => {
  const item = buatItem(
    { name: "a.pdf", size: 10, type: "application/pdf" },
    "id-1",
  );
  assert.deepEqual(item, {
    id: "id-1",
    nama: "a.pdf",
    ukuran: 10,
    status: "menunggu",
    progres: 0,
  });
});
