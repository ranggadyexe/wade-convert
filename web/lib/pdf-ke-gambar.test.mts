import assert from "node:assert/strict";
import { test } from "node:test";

import { namaHasilHalaman } from "./pdf-ke-gambar.ts";

test("namaHasilHalaman memakai nomor halaman dan ekstensi", () => {
  assert.equal(namaHasilHalaman("dokumen.pdf", 1, ".png"), "dokumen-hal-1.png");
  assert.equal(
    namaHasilHalaman("laporan.final.PDF", 12, ".jpg"),
    "laporan.final-hal-12.jpg",
  );
});
