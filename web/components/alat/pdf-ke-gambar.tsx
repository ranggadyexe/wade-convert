"use client";

import { useEffect, useRef, useState } from "react";

import { DaftarBerkas } from "@/components/daftar-berkas";
import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { buatItem, formatUkuran, type ItemBerkas } from "@/lib/berkas";
import { teks } from "@/lib/i18n";
import { EKSTENSI_PDF, muatPdf } from "@/lib/pdf";
import {
  renderHalaman,
  type FormatHalaman,
  type Skala,
} from "@/lib/pdf-ke-gambar";

type Hasil = {
  nama: string;
  url: string;
  ukuran: number;
};

export function AlatPdfKeGambar() {
  const [daftar, setDaftar] = useState<ItemBerkas[]>([]);
  const [format, setFormat] = useState<FormatHalaman>("image/png");
  const [skala, setSkala] = useState<Skala>("2");
  const [jumlahHalaman, setJumlahHalaman] = useState(0);
  const [galat, setGalat] = useState<string | null>(null);
  const [hasil, setHasil] = useState<Hasil[]>([]);
  const [sedangProses, setSedangProses] = useState(false);
  const berkasAsli = useRef(new Map<string, File>());
  const urlDibuat = useRef(new Set<string>());

  useEffect(() => {
    const url = urlDibuat.current;
    return () => {
      for (const u of url) URL.revokeObjectURL(u);
    };
  }, []);

  function lepasHasilLama() {
    for (const item of hasil) {
      URL.revokeObjectURL(item.url);
      urlDibuat.current.delete(item.url);
    }
    setHasil([]);
  }

  async function onTambah(berkas: File[]) {
    const file = berkas[0];
    if (!file) return;
    lepasHasilLama();
    setGalat(null);
    const id = crypto.randomUUID();
    berkasAsli.current.clear();
    berkasAsli.current.set(id, file);
    setDaftar([buatItem(file, id)]);
    try {
      const dokumen = await muatPdf(file);
      setJumlahHalaman(dokumen.getPageCount());
    } catch (error) {
      setJumlahHalaman(0);
      setGalat(error instanceof Error ? error.message : teks.keGambar.gagal);
    }
  }

  function onHapus(id: string) {
    lepasHasilLama();
    setGalat(null);
    setJumlahHalaman(0);
    berkasAsli.current.delete(id);
    setDaftar((sebelum) => sebelum.filter((isi) => isi.id !== id));
  }

  async function proses() {
    const item = daftar[0];
    const berkas = item ? berkasAsli.current.get(item.id) : undefined;
    if (!item || !berkas) return;
    setGalat(null);
    setSedangProses(true);
    setDaftar((sebelum) =>
      sebelum.map((isi) => ({ ...isi, status: "diproses", progres: 50 })),
    );
    try {
      const keluaran = await renderHalaman(berkas, { format, skala });
      lepasHasilLama();
      const baru = keluaran.map((halaman) => {
        const url = URL.createObjectURL(halaman.blob);
        urlDibuat.current.add(url);
        return { nama: halaman.nama, url, ukuran: halaman.blob.size };
      });
      setHasil(baru);
      setDaftar((sebelum) =>
        sebelum.map((isi) => ({ ...isi, status: "selesai", progres: 100 })),
      );
    } catch (error) {
      const pesan =
        error instanceof Error ? error.message : teks.keGambar.gagal;
      setGalat(pesan);
      setDaftar((sebelum) =>
        sebelum.map((isi) => ({
          ...isi,
          status: "gagal",
          progres: 0,
          pesan,
        })),
      );
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

      {daftar.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-sm">{teks.konversi.format}</span>
          <ToggleGroup
            type="single"
            variant="outline"
            value={format}
            onValueChange={(nilai) => {
              if (nilai) setFormat(nilai as FormatHalaman);
            }}
          >
            <ToggleGroupItem value="image/png">PNG</ToggleGroupItem>
            <ToggleGroupItem value="image/jpeg">JPG</ToggleGroupItem>
          </ToggleGroup>

          <span className="text-sm">{teks.keGambar.skala}</span>
          <ToggleGroup
            type="single"
            variant="outline"
            value={skala}
            onValueChange={(nilai) => {
              if (nilai) setSkala(nilai as Skala);
            }}
          >
            <ToggleGroupItem value="1">1x</ToggleGroupItem>
            <ToggleGroupItem value="2">2x</ToggleGroupItem>
            <ToggleGroupItem value="3">3x</ToggleGroupItem>
          </ToggleGroup>

          <Button
            type="button"
            onClick={proses}
            disabled={sedangProses || jumlahHalaman === 0}
          >
            {sedangProses ? teks.keGambar.memproses : teks.keGambar.proses}
          </Button>
        </div>
      ) : null}

      {galat ? <p className="mt-3 text-sm text-destructive">{galat}</p> : null}

      <DaftarBerkas daftar={daftar} onHapus={onHapus} />

      {hasil.length > 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{teks.keGambar.hasil}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {hasil.map((item) => (
              <div
                key={item.url}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatUkuran(item.ukuran)}
                  </p>
                </div>
                <Button asChild size="sm">
                  <a href={item.url} download={item.nama}>
                    {teks.unggah.unduh}
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
