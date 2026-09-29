import type { Metadata } from "next";

import { FormKontak } from "@/components/form-kontak";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { teks } from "@/lib/i18n";

export const metadata: Metadata = {
  title: `${teks.kontak.judul} — ${teks.namaSitus}`,
  description: teks.kontak.deskripsi,
};

export default function HalamanKontak() {
  return (
    <>
      <section className="max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {teks.kontak.judul}
        </h1>
        <p className="mt-3 text-muted-foreground">{teks.kontak.deskripsi}</p>
      </section>

      <section className="mt-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{teks.kontak.judulForm}</CardTitle>
            <CardDescription>{teks.kontak.catatan}</CardDescription>
          </CardHeader>
          <CardContent>
            <FormKontak />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
