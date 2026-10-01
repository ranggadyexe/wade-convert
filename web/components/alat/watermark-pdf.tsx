"use client";

import { useEffect, useRef, useState } from "react";

import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatUkuran } from "@/lib/berkas";
import { teks } from "@/lib/i18n";
import { EKSTENSI_PDF } from "@/lib/pdf";
import {
  OPASITAS_DEFAULT,
  UKURAN_DEFAULT,
  beriWatermark,
  namaHasilWatermark,
  type PosisiWatermark,
} from "@/lib/watermark-pdf";

type Hasil = { url: string; nama: string; ukuran: number };

export function AlatWatermarkPdf() {
  const [berkas, setBerkas] = useState<File | null>(null);
  const [namaBerkas, setNamaBerkas] = useState("");
  const [teksWatermark, setTeksWatermark] = useState("RAHASIA");
  const [ukuran, setUkuran] = useState(UKURAN_DEFAULT);
  const [opasitas, setOpasitas] = useState(OPASITAS_DEFAULT * 100);
  const [posisi, setPosisi] = useState<PosisiWatermark>("tengah");
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

  function onTambah(berkasBaru: File[]) {
    const file = berkasBaru[0];
    if (!file) return;
    lepasHasilLama();
    setGalat(null);
    setBerkas(file);
    setNamaBerkas(file.name);
  }

  async function proses() {
    if (!berkas) return;
    if (!teksWatermark.trim()) {
      setGalat(teks.watermark.teksKosong);
      return;
    }
    setGalat(null);
    setSedangProses(true);
    try {
      const blob = await beriWatermark(berkas, {
        teks: teksWatermark,
        ukuran,
        opasitas: opasitas / 100,
        posisi,
      });
      lepasHasilLama();
      const url = URL.createObjectURL(blob);
      urlDibuat.current.add(url);
      setHasil({
        url,
        nama: namaHasilWatermark(namaBerkas),
        ukuran: blob.size,
      });
    } catch (error) {
      setGalat(error instanceof Error ? error.message : teks.watermark.gagal);
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
        <div className="mt-6 grid gap-4">
          <p className="text-sm text-muted-foreground">{namaBerkas}</p>

          <div className="grid max-w-xs gap-2">
            <Label htmlFor="teks-watermark">{teks.watermark.teks}</Label>
            <Input
              id="teks-watermark"
              value={teksWatermark}
              onChange={(peristiwa) => setTeksWatermark(peristiwa.target.value)}
            />
          </div>

          <div className="grid max-w-xs gap-2">
            <span className="text-sm">
              {teks.watermark.ukuran}: {ukuran}
            </span>
            <Slider
              min={20}
              max={90}
              step={4}
              value={[ukuran]}
              onValueChange={(nilai) => setUkuran(nilai[0])}
              aria-label={teks.watermark.ukuran}
            />
          </div>

          <div className="grid max-w-xs gap-2">
            <span className="text-sm">
              {teks.watermark.opasitas}: {opasitas}%
            </span>
            <Slider
              min={5}
              max={50}
              step={5}
              value={[opasitas]}
              onValueChange={(nilai) => setOpasitas(nilai[0])}
              aria-label={teks.watermark.opasitas}
            />
          </div>

          <div className="grid gap-2">
            <span className="text-sm">{teks.watermark.posisi}</span>
            <ToggleGroup
              type="single"
              variant="outline"
              value={posisi}
              onValueChange={(nilai) => {
                if (nilai) setPosisi(nilai as PosisiWatermark);
              }}
            >
              <ToggleGroupItem value="tengah">
                {teks.watermark.tengah}
              </ToggleGroupItem>
              <ToggleGroupItem value="atas">
                {teks.watermark.atas}
              </ToggleGroupItem>
              <ToggleGroupItem value="bawah">
                {teks.watermark.bawah}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div>
            <Button type="button" onClick={proses} disabled={sedangProses}>
              {sedangProses ? teks.watermark.memproses : teks.watermark.proses}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {teks.watermark.catatan}
          </p>
        </div>
      ) : null}

      {galat ? <p className="mt-3 text-sm text-destructive">{galat}</p> : null}

      {hasil ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{teks.watermark.hasil}</CardTitle>
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
