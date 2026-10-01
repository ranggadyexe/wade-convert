import assert from "node:assert/strict";
import { test } from "node:test";

import { ALAT } from "./tools.ts";

test("daftar alat lengkap, unik, dengan proses dan status valid", () => {
  assert.equal(ALAT.length, 10);
  assert.equal(new Set(ALAT.map((alat) => alat.slug)).size, ALAT.length);
  assert.equal(ALAT.filter((alat) => alat.proses === "browser").length, 7);
  assert.equal(ALAT.filter((alat) => alat.proses === "server").length, 3);
  for (const alat of ALAT) {
    assert.ok(alat.nama.length > 0, "nama alat kosong");
    assert.ok(alat.deskripsi.length > 0, "deskripsi alat kosong");
    assert.ok(["browser", "server"].includes(alat.proses));
    assert.ok(["tersedia", "segera"].includes(alat.status));
  }
});
