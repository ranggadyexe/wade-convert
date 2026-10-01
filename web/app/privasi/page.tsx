import type { Metadata } from "next";

import { HalamanHukum } from "@/components/halaman-hukum";
import { teks } from "@/lib/i18n";

export const metadata: Metadata = {
  title: `${teks.privasi.judul} — ${teks.namaSitus}`,
  description: teks.privasi.draf,
};

export default function HalamanPrivasi() {
  return (
    <HalamanHukum
      judul={teks.privasi.judul}
      draf={teks.privasi.draf}
      diperbarui={teks.privasi.diperbarui}
      bagian={teks.privasi.bagian}
    />
  );
}
