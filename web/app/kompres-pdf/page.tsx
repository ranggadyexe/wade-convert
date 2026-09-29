import type { Metadata } from "next";

import { AlatKompresPdfServer } from "@/components/alat/kompres-pdf-server";
import { teks } from "@/lib/i18n";
import { ALAT } from "@/lib/tools";

const alat = ALAT.find((item) => item.slug === "kompres-pdf");

export const metadata: Metadata = {
  title: `${alat?.nama ?? teks.namaSitus} — ${teks.namaSitus}`,
  description: alat?.deskripsi,
};

export default function HalamanKompresPdf() {
  return (
    <>
      <section className="max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {alat?.nama}
        </h1>
        <p className="mt-3 text-muted-foreground">{alat?.deskripsi}</p>
        <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
          {teks.labelServer}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {teks.server.catatan}
        </p>
      </section>

      <section className="mt-8 max-w-2xl">
        <AlatKompresPdfServer />
      </section>
    </>
  );
}
