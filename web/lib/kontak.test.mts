import assert from "node:assert/strict";
import { test } from "node:test";

import { buatTautanMailto, emailValid } from "./kontak.ts";

test("buatTautanMailto menyusun subject dan body", () => {
  const tautan = buatTautanMailto({ nama: "Budi", pesan: "Halo!" });
  assert.ok(tautan.startsWith("mailto:ranggadewa853@gmail.com?"));
  assert.ok(tautan.includes("subject=Pesan%20dari%20Budi"));
  assert.ok(tautan.includes("body=Halo%21"));
});

test("buatTautanMailto menyertakan email dan memakai %20 untuk spasi", () => {
  const tautan = buatTautanMailto({
    nama: "Siti",
    email: "siti@contoh.com",
    pesan: "Tes satu",
  });
  assert.ok(tautan.includes("siti%40contoh.com"));
  assert.ok(tautan.includes("Tes%20satu"));
  assert.ok(!tautan.includes("+"));
});

test("emailValid menerima email wajar dan menolak yang tidak valid", () => {
  assert.ok(emailValid("a@b.co"));
  assert.ok(!emailValid("bukan-email"));
  assert.ok(!emailValid("a@b"));
});
