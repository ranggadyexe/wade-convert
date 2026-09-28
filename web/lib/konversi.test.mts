import assert from "node:assert/strict";
import { test } from "node:test";

import { FORMAT_KELUARAN, namaHasilKonversi } from "./konversi.ts";

test("namaHasilKonversi mengganti ekstensi", () => {
  assert.equal(namaHasilKonversi("foto.png", ".jpg"), "foto.jpg");
  assert.equal(
    namaHasilKonversi("scan.RAKYAT.JPEG", ".webp"),
    "scan.RAKYAT.webp",
  );
  assert.equal(
    namaHasilKonversi("tanpa-ekstensi", ".png"),
    "tanpa-ekstensi.png",
  );
});

test("FORMAT_KELUARAN punya tiga label unik", () => {
  assert.equal(FORMAT_KELUARAN.length, 3);
  assert.equal(new Set(FORMAT_KELUARAN.map((format) => format.label)).size, 3);
});
