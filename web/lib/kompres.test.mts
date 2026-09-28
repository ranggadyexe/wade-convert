import assert from "node:assert/strict";
import { test } from "node:test";

import { namaHasilKompres } from "./kompres.ts";

test("namaHasilKompres mengganti ekstensi dan menambah akhiran", () => {
  assert.equal(namaHasilKompres("foto.png"), "foto-kompres.jpg");
  assert.equal(namaHasilKompres("ARSIP.JPEG"), "ARSIP-kompres.jpg");
  assert.equal(
    namaHasilKompres("liburan.final.webp"),
    "liburan.final-kompres.jpg",
  );
  assert.equal(
    namaHasilKompres("tanpa-ekstensi"),
    "tanpa-ekstensi-kompres.jpg",
  );
});
