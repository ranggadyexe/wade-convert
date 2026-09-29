import assert from "node:assert/strict";
import { test } from "node:test";

import { urlApi } from "./api.ts";

test("urlApi menggabungkan basis dan jalur", () => {
  assert.ok(urlApi("/api/v1/convert/ocr").endsWith("/api/v1/convert/ocr"));
  assert.ok(urlApi("/api/v1/convert/ocr").startsWith("http"));
});

test("urlApi memakai NEXT_PUBLIC_API_URL atau default localhost", () => {
  const dasar = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  assert.equal(urlApi("/health"), `${dasar}/health`);
});
