"use client";

import { useEffect, useRef, useState } from "react";

import { DaftarBerkas } from "@/components/daftar-berkas";
import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buatItem, formatUkuran, type ItemBerkas } from "@/lib/berkas";
import { EKSTENSI_PDF, gabungPdf, namaHasilGabung } from "@/lib/gabung-pdf";
import { teks } from "@/lib/i18n";

type Hasil = {
  url: string;
  nama: string;
  ukuran: number;
  halaman: number;
};

export function AlatGabungPdf() {
  const [daftar, setDaftar] = useState<ItemBerkas[]>([]);
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [sedangProses, setSedangProses] = useState(false);
  const berkasAsli = useRef(new Map<string, File>());
  const urlDibuat = useRef(new Set<string>());

  useEffect(() => {
    const url = urlDibuat.current;
    return () => {
      for (const u of url) URL.revokeObjectURL(u);
    };
  }, []);

  function onTambah(berkas: File[]) {
    const item = berkas.map((file) => {
      const id = crypto.randomUUID();
      berkasAsli.current.set(id, file);
      return buatItem(file, id);
    });
    setDaftar((sebelum) => [...sebelum, ...item]);
  }

  function onHapus(id: string) {
    berkasAsli.current.delete(id);
    setDaftar((sebelum) => sebelum.filter((isi) => isi.id !== id));
  }

  function lepasHasilLama() {
    if (hasil?.url) {
      URL.revokeObjectURL(hasil.url);
      urlDibuat.current.delete(hasil.url);
    }
  }

  async function proses() {
    if (daftar.length === 0) return;
    setSedangProses(true);
    setDaftar((sebelum) =>
      sebelum.map((item) => ({ ...item, status: "diproses", progres: 50 })),
    );
    try {
      const berkas = daftar
        .map((item) => berkasAsli.current.get(item.id))
        .filter((file): file is File => Boolean(file));
      const { blob, jumlahHalaman } = await gabungPdf(berkas);
      lepasHasilLama();
      const url = URL.createObjectURL(blob);
      urlDibuat.current.add(url);
      setHasil({
        url,
        nama: namaHasilGabung(daftar[0].nama),
        ukuran: blob.size,
        halaman: jumlahHalaman,
      });
      setDaftar((sebelum) =>
        sebelum.map((item) => ({ ...item, status: "selesai", progres: 100 })),
      );
    } catch (error) {
      const pesan = error instanceof Error ? error.message : teks.gabung.gagal;
      setDaftar((sebelum) =>
        sebelum.map((item) => ({
          ...item,
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
      <DropzoneBerkas terima={EKSTENSI_PDF} onTambah={onTambah} />

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button
          type="button"
          onClick={proses}
          disabled={daftar.length === 0 || sedangProses}
        >
          {sedangProses ? teks.gabung.memproses : teks.gabung.proses}
        </Button>
        <p className="text-sm text-muted-foreground">{teks.gabung.urutan}</p>
      </div>

      <DaftarBerkas daftar={daftar} onHapus={onHapus} />

      {hasil ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{teks.gabung.hasil}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{hasil.nama}</p>
              <p className="text-xs text-muted-foreground">
                {teks.gabung.halaman(hasil.halaman)} ·{" "}
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
