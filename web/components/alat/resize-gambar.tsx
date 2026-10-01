"use client";

import { useEffect, useRef, useState } from "react";

import { DaftarBerkas } from "@/components/daftar-berkas";
import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { buatItem, type ItemBerkas } from "@/lib/berkas";
import { teks } from "@/lib/i18n";
import { EKSTENSI_GAMBAR } from "@/lib/kompres";
import { PRESET, namaHasilResize, resizeGambar } from "@/lib/resize";

export function AlatResizeGambar() {
  const [daftar, setDaftar] = useState<ItemBerkas[]>([]);
  const [slugPreset, setSlugPreset] = useState<string>(PRESET[1].slug);
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
    const preset = PRESET.find((pilihan) => pilihan.slug === slugPreset);
    if (!preset) return;
    const antre = daftar.filter((item) => item.status === "menunggu");
    if (antre.length === 0) return;
    setSedangProses(true);
    for (const item of antre) {
      const berkas = berkasAsli.current.get(item.id);
      if (!berkas) continue;
      ubah(item.id, { status: "diproses", progres: 40 });
      try {
        const hasil = await resizeGambar(berkas, preset);
        const url = URL.createObjectURL(hasil);
        urlDibuat.current.add(url);
        ubah(item.id, {
          status: "selesai",
          progres: 100,
          urlHasil: url,
          namaHasil: namaHasilResize(item.nama, preset),
          ukuranHasil: hasil.size,
        });
      } catch {
        ubah(item.id, {
          status: "gagal",
          progres: 0,
          pesan: teks.resize.gagal,
        });
      }
    }
    setSedangProses(false);
  }

  const adaMenunggu = daftar.some((item) => item.status === "menunggu");

  return (
    <div>
      <DropzoneBerkas terima={EKSTENSI_GAMBAR} onTambah={onTambah} />

      <div className="mt-6 space-y-3">
        <p className="text-sm">{teks.resize.preset}</p>
        <ToggleGroup
          type="single"
          variant="outline"
          className="flex-wrap justify-start"
          value={slugPreset}
          onValueChange={(nilai) => {
            if (nilai) setSlugPreset(nilai);
          }}
        >
          {PRESET.map((preset) => (
            <ToggleGroupItem key={preset.slug} value={preset.slug}>
              {preset.nama}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="text-xs text-muted-foreground">{teks.resize.catatan}</p>
      </div>

      <div className="mt-6">
        <Button
          type="button"
          onClick={proses}
          disabled={!adaMenunggu || sedangProses}
        >
          {sedangProses ? teks.resize.memproses : teks.resize.proses}
        </Button>
      </div>

      <DaftarBerkas daftar={daftar} onHapus={onHapus} />
    </div>
  );
}
