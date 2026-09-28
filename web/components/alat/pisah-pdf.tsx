"use client";

import { useEffect, useRef, useState } from "react";

import { DaftarBerkas } from "@/components/daftar-berkas";
import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buatItem, formatUkuran, type ItemBerkas } from "@/lib/berkas";
import { teks } from "@/lib/i18n";
import { EKSTENSI_PDF, muatPdf } from "@/lib/pdf";
import { namaHasilPisah, parseRentang, pisahPdf } from "@/lib/pisah-pdf";

type Hasil = {
  url: string;
  nama: string;
  ukuran: number;
  halaman: number;
};

export function AlatPisahPdf() {
  const [daftar, setDaftar] = useState<ItemBerkas[]>([]);
  const [jumlahHalaman, setJumlahHalaman] = useState(0);
  const [rentang, setRentang] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
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

  function lepasHasilLama() {
    if (hasil?.url) {
      URL.revokeObjectURL(hasil.url);
      urlDibuat.current.delete(hasil.url);
    }
  }

  async function onTambah(berkas: File[]) {
    const file = berkas[0];
    if (!file) return;
    lepasHasilLama();
    setHasil(null);
    setGalat(null);
    const id = crypto.randomUUID();
    berkasAsli.current.clear();
    berkasAsli.current.set(id, file);
    setDaftar([buatItem(file, id)]);
    try {
      const dokumen = await muatPdf(file);
      const jumlah = dokumen.getPageCount();
      setJumlahHalaman(jumlah);
      setRentang(`1-${jumlah}`);
    } catch (error) {
      setJumlahHalaman(0);
      setRentang("");
      setGalat(error instanceof Error ? error.message : teks.pisah.gagal);
    }
  }

  function onHapus(id: string) {
    lepasHasilLama();
    setHasil(null);
    setGalat(null);
    setJumlahHalaman(0);
    setRentang("");
    berkasAsli.current.delete(id);
    setDaftar((sebelum) => sebelum.filter((isi) => isi.id !== id));
  }

  async function proses() {
    const item = daftar[0];
    const berkas = item ? berkasAsli.current.get(item.id) : undefined;
    if (!item || !berkas) return;
    setGalat(null);
    let indeks: number[];
    try {
      indeks = parseRentang(rentang, jumlahHalaman);
    } catch (error) {
      setGalat(error instanceof Error ? error.message : teks.pisah.gagal);
      return;
    }
    setSedangProses(true);
    setDaftar((sebelum) =>
      sebelum.map((isi) => ({ ...isi, status: "diproses", progres: 50 })),
    );
    try {
      const { blob, jumlahHalaman: jumlah } = await pisahPdf(berkas, indeks);
      lepasHasilLama();
      const url = URL.createObjectURL(blob);
      urlDibuat.current.add(url);
      setHasil({
        url,
        nama: namaHasilPisah(item.nama),
        ukuran: blob.size,
        halaman: jumlah,
      });
      setDaftar((sebelum) =>
        sebelum.map((isi) => ({ ...isi, status: "selesai", progres: 100 })),
      );
    } catch (error) {
      const pesan = error instanceof Error ? error.message : teks.pisah.gagal;
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
        <div className="mt-6 flex flex-wrap items-end gap-4">
          <div className="grid w-full max-w-xs gap-2">
            <Label htmlFor="rentang">{teks.pisah.rentang}</Label>
            <Input
              id="rentang"
              value={rentang}
              onChange={(event) => setRentang(event.target.value)}
              placeholder="1-3, 5, 7-9"
            />
            <p className="text-xs text-muted-foreground">
              {jumlahHalaman > 0
                ? teks.jumlahHalaman(jumlahHalaman)
                : teks.pisah.gagal}
            </p>
          </div>
          <Button
            type="button"
            onClick={proses}
            disabled={sedangProses || !rentang.trim()}
          >
            {sedangProses ? teks.pisah.memproses : teks.pisah.proses}
          </Button>
        </div>
      ) : null}

      {galat ? <p className="mt-3 text-sm text-destructive">{galat}</p> : null}

      <DaftarBerkas daftar={daftar} onHapus={onHapus} />

      {hasil ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{teks.pisah.hasil}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{hasil.nama}</p>
              <p className="text-xs text-muted-foreground">
                {teks.jumlahHalaman(hasil.halaman)} ·{" "}
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
