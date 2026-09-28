"use client";

import { useEffect, useRef, useState } from "react";

import { DaftarBerkas } from "@/components/daftar-berkas";
import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { buatItem, type ItemBerkas } from "@/lib/berkas";
import { teks } from "@/lib/i18n";
import { EKSTENSI_GAMBAR } from "@/lib/kompres";
import {
  FORMAT_KELUARAN,
  konversiGambar,
  namaHasilKonversi,
  type FormatKeluaran,
} from "@/lib/konversi";

export function AlatKonversiGambar() {
  const [daftar, setDaftar] = useState<ItemBerkas[]>([]);
  const [format, setFormat] = useState<FormatKeluaran>("image/jpeg");
  const [kualitas, setKualitas] = useState(0.92);
  const [sedangProses, setSedangProses] = useState(false);
  const berkasAsli = useRef(new Map<string, File>());
  const urlDibuat = useRef(new Set<string>());

  useEffect(() => {
    const url = urlDibuat.current;
    return () => {
      for (const u of url) URL.revokeObjectURL(u);
    };
  }, []);

  function ubah(id: string, patch: Partial<ItemBerkas>) {
    setDaftar((sebelum) =>
      sebelum.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function onTambah(berkas: File[]) {
    const item = berkas.map((file) => {
      const id = crypto.randomUUID();
      berkasAsli.current.set(id, file);
      return buatItem(file, id);
    });
    setDaftar((sebelum) => [...sebelum, ...item]);
  }

  function onHapus(id: string) {
    const item = daftar.find((isi) => isi.id === id);
    if (item?.urlHasil) {
      URL.revokeObjectURL(item.urlHasil);
      urlDibuat.current.delete(item.urlHasil);
    }
    berkasAsli.current.delete(id);
    setDaftar((sebelum) => sebelum.filter((isi) => isi.id !== id));
  }

  async function proses() {
    const antre = daftar.filter((item) => item.status === "menunggu");
    if (antre.length === 0) return;
    const ekstensi =
      FORMAT_KELUARAN.find((pilihan) => pilihan.nilai === format)?.ekstensi ??
      ".jpg";
    setSedangProses(true);
    for (const item of antre) {
      const berkas = berkasAsli.current.get(item.id);
      if (!berkas) continue;
      ubah(item.id, { status: "diproses", progres: 40 });
      try {
        const hasil = await konversiGambar(berkas, format, { kualitas });
        const url = URL.createObjectURL(hasil);
        urlDibuat.current.add(url);
        ubah(item.id, {
          status: "selesai",
          progres: 100,
          urlHasil: url,
          namaHasil: namaHasilKonversi(item.nama, ekstensi),
          ukuranHasil: hasil.size,
        });
      } catch {
        ubah(item.id, {
          status: "gagal",
          progres: 0,
          pesan: teks.konversi.gagal,
        });
      }
    }
    setSedangProses(false);
  }

  const adaMenunggu = daftar.some((item) => item.status === "menunggu");

  return (
    <div>
      <DropzoneBerkas terima={EKSTENSI_GAMBAR} onTambah={onTambah} />

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <span className="text-sm">{teks.konversi.format}</span>
        <ToggleGroup
          type="single"
          variant="outline"
          value={format}
          onValueChange={(nilai) => {
            if (nilai) setFormat(nilai as FormatKeluaran);
          }}
        >
          {FORMAT_KELUARAN.map((pilihan) => (
            <ToggleGroupItem key={pilihan.nilai} value={pilihan.nilai}>
              {pilihan.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button
          type="button"
          onClick={proses}
          disabled={!adaMenunggu || sedangProses}
        >
          {sedangProses ? teks.konversi.memproses : teks.konversi.proses}
        </Button>
      </div>

      {format !== "image/png" ? (
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm whitespace-nowrap">
            {teks.kompres.kualitas}: {Math.round(kualitas * 100)}%
          </span>
          <Slider
            className="min-w-40 max-w-64 flex-1"
            min={0.3}
            max={0.95}
            step={0.05}
            value={[kualitas]}
            onValueChange={(nilai) => setKualitas(nilai[0])}
            aria-label={teks.kompres.kualitas}
          />
        </div>
      ) : null}

      <DaftarBerkas daftar={daftar} onHapus={onHapus} />
    </div>
  );
}
