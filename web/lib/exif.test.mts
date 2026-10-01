import assert from "node:assert/strict";
import { test } from "node:test";

import { namaHasilTanpaExif, ringkasExif } from "./exif.ts";

test("ringkasExif menghitung field dan mendeteksi GPS", () => {
  const data = {
    Make: "Canon",
    Model: "EOS",
    DateTimeOriginal: new Date("2026-01-01"),
    GPSLatitude: -6.2,
    GPSLongitude: 106.8,
    Thumbnail: new Uint8Array(10),
  };
  assert.deepEqual(ringkasExif(data), { jumlahField: 5, adaGps: true });
});

test("ringkasExif menangani data kosong", () => {
  assert.deepEqual(ringkasExif(null), { jumlahField: 0, adaGps: false });
  assert.deepEqual(ringkasExif({}), { jumlahField: 0, adaGps: false });
  assert.deepEqual(ringkasExif({ Make: null }), {
    jumlahField: 0,
    adaGps: false,
  });
});

test("namaHasilTanpaExif mempertahankan PNG dan mengganti lainnya ke jpg", () => {
  assert.equal(namaHasilTanpaExif("foto.JPEG"), "foto-tanpa-exif.jpg");
  assert.equal(namaHasilTanpaExif("scan.PNG"), "scan-tanpa-exif.png");
  assert.equal(
    namaHasilTanpaExif("tanpa-ekstensi"),
    "tanpa-ekstensi-tanpa-exif.jpg",
  );
});
