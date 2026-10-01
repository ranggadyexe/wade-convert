"use client";

import { useEffect, useRef, useState } from "react";

import { DaftarBerkas } from "@/components/daftar-berkas";
import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { Button } from "@/components/ui/button";
import { buatItem, type ItemBerkas } from "@/lib/berkas";
import {
  bacaExif,
  hapusExif,
  namaHasilTanpaExif,
  ringkasExif,
} from "@/lib/exif";
import { teks } from "@/lib/i18n";
import { EKSTENSI_GAMBAR } from "@/lib/kompres";

export function AlatHapusExif() {
  const [daftar, setDaftar] = useState<ItemBerkas[]>([]);
  const [sedangProses, setSedangProses] = useState(false);
  const [ringkasan, setRingkasan] = useState<{
    jumlah: number;
    gps: boolean;
  } | null>(null);
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
    setSedangProses(true);
    let jumlahField = 0;
    let adaGps = false;
    for (const item of antre) {
      const berkas = berkasAsli.current.get(item.id);
      if (!berkas) continue;
      ubah(item.id, { status: "diproses", progres: 40 });
      try {
        const data = await bacaExif(berkas);
        const info = ringkasExif(data);
        jumlahField += info.jumlahField;
        adaGps = adaGps || info.adaGps;
        const hasil = await hapusExif(berkas);
        const url = URL.createObjectURL(hasil);
        urlDibuat.current.add(url);
        ubah(item.id, {
          status: "selesai",
          progres: 100,
          urlHasil: url,
          namaHasil: namaHasilTanpaExif(item.nama),
          ukuranHasil: hasil.size,
        });
      } catch {
        ubah(item.id, {
          status: "gagal",
          progres: 0,
          pesan: teks.exif.gagal,
        });
      }
    }
    setRingkasan({ jumlah: jumlahField, gps: adaGps });
    setSedangProses(false);
  }

  const adaMenunggu = daftar.some((item) => item.status === "menunggu");

  return (
    <div>
      <DropzoneBerkas terima={EKSTENSI_GAMBAR} onTambah={onTambah} />

      <div className="mt-6 space-y-2">
        <Button
          type="button"
          onClick={proses}
          disabled={!adaMenunggu || sedangProses}
        >
          {sedangProses ? teks.exif.memproses : teks.exif.proses}
        </Button>
        {ringkasan ? (
          <p className="text-sm text-muted-foreground" role="status">
            {ringkasan.jumlah > 0
              ? teks.exif.hasil(ringkasan.jumlah, ringkasan.gps)
              : teks.exif.tidakAda}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">{teks.exif.catatan}</p>
      </div>

      <DaftarBerkas daftar={daftar} onHapus={onHapus} />
    </div>
  );
}
