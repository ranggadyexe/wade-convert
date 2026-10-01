import assert from "node:assert/strict";
import { test } from "node:test";

import { PRESET, hitungPotong, namaHasilResize } from "./resize.ts";

test("hitungPotong memotong tengah sesuai rasio target", () => {
  assert.deepEqual(hitungPotong(1000, 1000, 354, 472), {
    sx: 125,
    sy: 0,
    lebar: 750,
    tinggi: 1000,
  });
  assert.deepEqual(hitungPotong(1000, 500, 354, 472), {
    sx: 313,
    sy: 0,
    lebar: 375,
    tinggi: 500,
  });
  assert.deepEqual(hitungPotong(354, 472, 354, 472), {
    sx: 0,
    sy: 0,
    lebar: 354,
    tinggi: 472,
  });
});

test("PRESET lengkap dan slug unik", () => {
  assert.equal(PRESET.length, 5);
  assert.equal(
    new Set(PRESET.map((preset) => preset.slug)).size,
    PRESET.length,
  );
  for (const preset of PRESET) {
    assert.ok(preset.lebar > 0 && preset.tinggi > 0);
  }
});

test("namaHasilResize memakai slug preset", () => {
  const tigaEmpat = PRESET.find((preset) => preset.slug === "pas-foto-3x4");
  assert.ok(tigaEmpat);
  assert.equal(namaHasilResize("foto.png", tigaEmpat), "foto-pas-foto-3x4.jpg");
});
