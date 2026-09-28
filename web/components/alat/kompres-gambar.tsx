"use client";

import { useEffect, useRef, useState } from "react";

import { DaftarBerkas } from "@/components/daftar-berkas";
import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { buatItem, type ItemBerkas } from "@/lib/berkas";
import { teks } from "@/lib/i18n";
import {
  EKSTENSI_GAMBAR,
  KUALITAS_DEFAULT,
  kompresGambar,
  namaHasilKompres,
} from "@/lib/kompres";

export function AlatKompresGambar() {
  const [daftar, setDaftar] = useState<ItemBerkas[]>([]);
  const [kualitas, setKualitas] = useState(KUALITAS_DEFAULT);
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
    setSedangProses(true);
    for (const item of antre) {
      const berkas = berkasAsli.current.get(item.id);
      if (!berkas) continue;
      ubah(item.id, { status: "diproses", progres: 40 });
      try {
        const hasil = await kompresGambar(berkas, { kualitas });
        const url = URL.createObjectURL(hasil);
        urlDibuat.current.add(url);
        ubah(item.id, {
          status: "selesai",
          progres: 100,
          urlHasil: url,
          namaHasil: namaHasilKompres(item.nama),
          ukuranHasil: hasil.size,
        });
      } catch {
        ubah(item.id, {
          status: "gagal",
          progres: 0,
          pesan: teks.kompres.gagal,
        });
      }
    }
    setSedangProses(false);
  }

  const adaMenunggu = daftar.some((item) => item.status === "menunggu");

  return (
    <div>
      <DropzoneBerkas terima={EKSTENSI_GAMBAR} onTambah={onTambah} />

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <label className="flex flex-1 items-center gap-3 text-sm">
          <span className="whitespace-nowrap">
            {teks.kompres.kualitas}: {Math.round(kualitas * 100)}%
          </span>
          <input
            type="range"
            min={0.3}
            max={0.95}
            step={0.05}
            value={kualitas}
            onChange={(event) => setKualitas(Number(event.target.value))}
            className="w-full accent-sky-600"
          />
        </label>
        <button
          type="button"
          onClick={proses}
          disabled={!adaMenunggu || sedangProses}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
        >
          {sedangProses ? teks.kompres.memproses : teks.kompres.proses}
        </button>
      </div>

      <DaftarBerkas daftar={daftar} onHapus={onHapus} />
    </div>
  );
}
