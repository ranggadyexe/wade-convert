import type { Metadata } from "next";

import { AlatKompresGambar } from "@/components/alat/kompres-gambar";
import { teks } from "@/lib/i18n";
import { ALAT } from "@/lib/tools";

const alat = ALAT.find((item) => item.slug === "kompres-gambar");

export const metadata: Metadata = {
  title: `${alat?.nama ?? teks.namaSitus} — ${teks.namaSitus}`,
  description: alat?.deskripsi,
};

export default function HalamanKompresGambar() {
  return (
    <>
      <section className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">{alat?.nama}</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          {alat?.deskripsi}
        </p>
        <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          {teks.labelBrowser}
        </p>
      </section>

      <section className="mt-8 max-w-2xl">
        <AlatKompresGambar />
      </section>
    </>
  );
}
