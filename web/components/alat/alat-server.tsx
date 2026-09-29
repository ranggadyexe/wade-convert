"use client";

import { useEffect, useRef, useState } from "react";

import { DaftarBerkas } from "@/components/daftar-berkas";
import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { Button } from "@/components/ui/button";
import { unggahBerkas, urlApi } from "@/lib/api";
import { buatItem, type ItemBerkas } from "@/lib/berkas";
import { teks } from "@/lib/i18n";

type Props = {
  jalur: string;
  terima: readonly string[];
  banyak?: boolean;
  params?: Record<string, string>;
  children?: React.ReactNode;
};

export function AlatServer({
  jalur,
  terima,
  banyak = false,
  params,
  children,
}: Props) {
  const [daftar, setDaftar] = useState<ItemBerkas[]>([]);
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
      ubah(item.id, { status: "diproses", progres: 5 });
      try {
        const hasil = await unggahBerkas(berkas, jalur, {
          params,
          onProgres: (persen) =>
            ubah(item.id, { progres: Math.min(90, Math.round(persen)) }),
        });
        ubah(item.id, {
          status: "selesai",
          progres: 100,
          urlHasil: urlApi(hasil.url_unduh),
          namaHasil: hasil.nama_hasil,
          ukuranHasil: hasil.ukuran_hasil,
        });
      } catch (galat) {
        ubah(item.id, {
          status: "gagal",
          progres: 0,
          pesan: galat instanceof Error ? galat.message : teks.server.gagal,
        });
      }
    }
    setSedangProses(false);
  }

  const adaMenunggu = daftar.some((item) => item.status === "menunggu");

  return (
    <div>
      <DropzoneBerkas terima={terima} banyak={banyak} onTambah={onTambah} />

      {children}

      <div className="mt-6">
        <Button
          type="button"
          onClick={proses}
          disabled={!adaMenunggu || sedangProses}
        >
          {sedangProses ? teks.server.memproses : teks.server.proses}
        </Button>
      </div>

      <DaftarBerkas daftar={daftar} onHapus={onHapus} />
    </div>
  );
}
