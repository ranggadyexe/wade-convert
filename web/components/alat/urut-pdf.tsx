"use client";

import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUkuran } from "@/lib/berkas";
import { teks } from "@/lib/i18n";
import { EKSTENSI_PDF } from "@/lib/pdf";
import {
  bacaJumlahHalaman,
  namaHasilUrut,
  pindahItem,
  putar,
  susunPdf,
  type Halaman,
} from "@/lib/urut-pdf";

type Hasil = { url: string; nama: string; ukuran: number };

export function AlatUrutPdf() {
  const [berkas, setBerkas] = useState<File | null>(null);
  const [namaBerkas, setNamaBerkas] = useState("");
  const [halaman, setHalaman] = useState<Halaman[]>([]);
  const [galat, setGalat] = useState<string | null>(null);
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [sedangProses, setSedangProses] = useState(false);
  const urlDibuat = useRef(new Set<string>());

  useEffect(() => {
    const url = urlDibuat.current;
    return () => {
      for (const u of url) URL.revokeObjectURL(u);
    };
  }, []);

  function lepasHasilLama() {
    if (hasil?.url) {
      URL.revokeObjectURL(hasil.url);
      urlDibuat.current.delete(hasil.url);
    }
    setHasil(null);
  }

  async function onTambah(berkasBaru: File[]) {
    const file = berkasBaru[0];
    if (!file) return;
    lepasHasilLama();
    setGalat(null);
    try {
      const jumlah = await bacaJumlahHalaman(file);
      setBerkas(file);
      setNamaBerkas(file.name);
      setHalaman(
        Array.from({ length: jumlah }, (_, indeks) => ({
          asal: indeks,
          rotasi: 0,
        })),
      );
    } catch (error) {
      setBerkas(null);
      setHalaman([]);
      setGalat(error instanceof Error ? error.message : teks.urut.gagal);
    }
  }

  function putarHalaman(indeks: number) {
    setHalaman((sebelum) =>
      sebelum.map((info, posisi) =>
        posisi === indeks ? { ...info, rotasi: putar(info.rotasi, 90) } : info,
      ),
    );
  }

  function geser(indeks: number, arah: -1 | 1) {
    setHalaman((sebelum) => pindahItem(sebelum, indeks, indeks + arah));
  }

  async function proses() {
    if (!berkas || halaman.length === 0) return;
    setGalat(null);
    setSedangProses(true);
    try {
      const blob = await susunPdf(berkas, halaman);
      lepasHasilLama();
      const url = URL.createObjectURL(blob);
      urlDibuat.current.add(url);
      setHasil({ url, nama: namaHasilUrut(namaBerkas), ukuran: blob.size });
    } catch (error) {
      setGalat(error instanceof Error ? error.message : teks.urut.gagal);
    }
    setSedangProses(false);
  }

  return (
    <div>
      <DropzoneBerkas
        terima={EKSTENSI_PDF}
        banyak={false}
        onTambah={onTambah}
      />

      {berkas ? (
        <>
          <p className="mt-4 text-sm text-muted-foreground">
            {namaBerkas} · {teks.jumlahHalaman(halaman.length)}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {halaman.map((info, indeks) => (
              <li
                key={info.asal}
                className="flex items-center gap-1 rounded-lg border border-border px-2 py-1"
              >
                <span className="px-1 text-sm">
                  Hal. {info.asal + 1}
                  {info.rotasi ? ` · ${info.rotasi}°` : ""}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={indeks === 0}
                  onClick={() => geser(indeks, -1)}
                  aria-label={`${teks.urut.keKiri} ${info.asal + 1}`}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={indeks === halaman.length - 1}
                  onClick={() => geser(indeks, 1)}
                  aria-label={`${teks.urut.keKanan} ${info.asal + 1}`}
                >
                  <ChevronRight />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => putarHalaman(indeks)}
                  aria-label={`${teks.urut.putar} ${info.asal + 1}`}
                >
                  <RotateCw />
                </Button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            {teks.urut.catatan}
          </p>
          <div className="mt-4">
            <Button type="button" onClick={proses} disabled={sedangProses}>
              {sedangProses ? teks.urut.memproses : teks.urut.proses}
            </Button>
          </div>
        </>
      ) : null}

      {galat ? <p className="mt-3 text-sm text-destructive">{galat}</p> : null}

      {hasil ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{teks.urut.hasil}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{hasil.nama}</p>
              <p className="text-xs text-muted-foreground">
                {formatUkuran(hasil.ukuran)}
              </p>
            </div>
            <Button asChild size="sm">
              <a href={hasil.url} download={hasil.nama}>
                {teks.unggah.unduh}
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
