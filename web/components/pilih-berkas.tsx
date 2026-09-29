"use client";

import Link from "next/link";
import { useState } from "react";

import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { teks } from "@/lib/i18n";
import { EKSTENSI_GAMBAR } from "@/lib/kompres";
import { EKSTENSI_PDF } from "@/lib/pdf";
import { saranAlat } from "@/lib/saran";
import { ALAT } from "@/lib/tools";

const TERIMA = [...EKSTENSI_PDF, ...EKSTENSI_GAMBAR];

export function PilihBerkas() {
  const [nama, setNama] = useState<string[]>([]);
  const saran = saranAlat(nama);

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{teks.pilih.judul}</CardTitle>
        <CardDescription>{teks.pilih.deskripsi}</CardDescription>
      </CardHeader>
      <CardContent>
        <DropzoneBerkas
          terima={TERIMA}
          onTambah={(berkas) => setNama(berkas.map((file) => file.name))}
        />

        {nama.length > 0 ? (
          <div className="mt-4 text-center">
            {saran.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {teks.pilih.saran}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {saran.map((slug) => {
                    const alat = ALAT.find((item) => item.slug === slug);
                    if (!alat) return null;
                    return (
                      <Button key={slug} asChild size="sm" variant="secondary">
                        <Link href={`/${slug}`}>{alat.nama}</Link>
                      </Button>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {teks.pilih.tidakCocok}
              </p>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
