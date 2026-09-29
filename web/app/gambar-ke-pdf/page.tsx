import type { Metadata } from "next";

import { AlatGambarKePdf } from "@/components/alat/gambar-ke-pdf";
import { teks } from "@/lib/i18n";
import { ALAT } from "@/lib/tools";

const alat = ALAT.find((item) => item.slug === "gambar-ke-pdf");

export const metadata: Metadata = {
  title: `${alat?.nama ?? teks.namaSitus} — ${teks.namaSitus}`,
  description: alat?.deskripsi,
};

export default function HalamanGambarKePdf() {
  return (
    <>
      <section className="max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {alat?.nama}
        </h1>
        <p className="mt-3 text-muted-foreground">{alat?.deskripsi}</p>
        <p className="mt-2 text-xs font-medium text-primary">
          {teks.labelBrowser}
        </p>
      </section>

      <section className="mt-8 max-w-2xl">
        <AlatGambarKePdf />
      </section>
    </>
  );
}
