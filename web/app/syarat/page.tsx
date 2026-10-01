import type { Metadata } from "next";

import { HalamanHukum } from "@/components/halaman-hukum";
import { teks } from "@/lib/i18n";

export const metadata: Metadata = {
  title: `${teks.syarat.judul} — ${teks.namaSitus}`,
  description: teks.syarat.draf,
};

export default function HalamanSyarat() {
  return (
    <HalamanHukum
      judul={teks.syarat.judul}
      draf={teks.syarat.draf}
      diperbarui={teks.syarat.diperbarui}
      bagian={teks.syarat.bagian}
    />
  );
}
