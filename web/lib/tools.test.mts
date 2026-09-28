import assert from "node:assert/strict";
import { test } from "node:test";

import { ALAT } from "./tools.ts";

test("daftar alat tahap 1 lengkap, unik, dan semuanya diproses di browser", () => {
  assert.equal(ALAT.length, 6);
  assert.equal(new Set(ALAT.map((alat) => alat.slug)).size, ALAT.length);
  for (const alat of ALAT) {
    assert.ok(alat.nama.length > 0, "nama alat kosong");
    assert.ok(alat.deskripsi.length > 0, "deskripsi alat kosong");
    assert.equal(alat.proses, "browser");
  }
});
