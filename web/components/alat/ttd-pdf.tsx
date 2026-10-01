"use client";

import { useEffect, useRef, useState } from "react";

import { DropzoneBerkas } from "@/components/dropzone-berkas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatUkuran } from "@/lib/berkas";
import { teks } from "@/lib/i18n";
import { EKSTENSI_PDF } from "@/lib/pdf";
import { namaHasilTtd, tempelTandaTangan, type Posisi } from "@/lib/ttd-pdf";

type Hasil = { url: string; nama: string; ukuran: number };

export function AlatTtdPdf() {
  const [berkas, setBerkas] = useState<File | null>(null);
  const [namaBerkas, setNamaBerkas] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [halaman, setHalaman] = useState("1");
  const [posisi, setPosisi] = useState<Posisi>("tengah");
  const [galat, setGalat] = useState<string | null>(null);
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [sedangProses, setSedangProses] = useState(false);
  const kanvasRef = useRef<HTMLCanvasElement>(null);
  const menggambar = useRef(false);
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
    setHalaman("1");
  }

  function koordinat(peristiwa: React.PointerEvent<HTMLCanvasElement>) {
    const kanvas = kanvasRef.current;
    if (!kanvas) return { x: 0, y: 0 };
    const kotak = kanvas.getBoundingClientRect();
    return {
      x: ((peristiwa.clientX - kotak.left) / kotak.width) * kanvas.width,
      y: ((peristiwa.clientY - kotak.top) / kotak.height) * kanvas.height,
    };
  }

  function mulaiGambar(peristiwa: React.PointerEvent<HTMLCanvasElement>) {
    const kanvas = kanvasRef.current;
    const konteks = kanvas?.getContext("2d");
    if (!kanvas || !konteks) return;
    menggambar.current = true;
    konteks.strokeStyle = "#111827";
    konteks.lineWidth = 2.5;
    konteks.lineCap = "round";
    konteks.lineJoin = "round";
    const { x, y } = koordinat(peristiwa);
    konteks.beginPath();
    konteks.moveTo(x, y);
  }

  function gambar(peristiwa: React.PointerEvent<HTMLCanvasElement>) {
    if (!menggambar.current) return;
    const konteks = kanvasRef.current?.getContext("2d");
    if (!konteks) return;
    const { x, y } = koordinat(peristiwa);
    konteks.lineTo(x, y);
    konteks.stroke();
  }

  function selesaiGambar() {
    if (!menggambar.current) return;
    menggambar.current = false;
    const kanvas = kanvasRef.current;
    if (kanvas) setDataUrl(kanvas.toDataURL("image/png"));
  }

  function bersihkanKanvas() {
    const kanvas = kanvasRef.current;
    const konteks = kanvas?.getContext("2d");
    if (!kanvas || !konteks) return;
    konteks.clearRect(0, 0, kanvas.width, kanvas.height);
    setDataUrl("");
  }

  async function proses() {
    if (!berkas || !dataUrl) return;
    const nomor = Number.parseInt(halaman, 10);
    if (!Number.isFinite(nomor) || nomor < 1) {
      setGalat(teks.ttd.halamanTidakValid);
      return;
    }
    setGalat(null);
    setSedangProses(true);
    try {
      const blob = await tempelTandaTangan(berkas, dataUrl, {
        halaman: nomor,
        posisi,
      });
      lepasHasilLama();
      const url = URL.createObjectURL(blob);
      urlDibuat.current.add(url);
      setHasil({ url, nama: namaHasilTtd(namaBerkas), ukuran: blob.size });
    } catch (error) {
      setGalat(error instanceof Error ? error.message : teks.ttd.gagal);
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
          <div className="mt-6 grid gap-3">
            <p className="text-sm text-muted-foreground">{namaBerkas}</p>
            <p className="text-sm">{teks.ttd.kanvas}</p>
            <canvas
              ref={kanvasRef}
              width={500}
              height={200}
              className="w-full max-w-lg touch-none rounded-lg border border-border bg-white"
              onPointerDown={mulaiGambar}
              onPointerMove={gambar}
              onPointerUp={selesaiGambar}
              onPointerLeave={selesaiGambar}
            />
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={bersihkanKanvas}
              >
                {teks.ttd.hapus}
              </Button>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div className="grid gap-2">
                <Label htmlFor="halaman">{teks.ttd.halaman}</Label>
                <Input
                  id="halaman"
                  inputMode="numeric"
                  className="w-24"
                  value={halaman}
                  onChange={(peristiwa) => setHalaman(peristiwa.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm">{teks.ttd.posisi}</span>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={posisi}
                  onValueChange={(nilai) => {
                    if (nilai) setPosisi(nilai as Posisi);
                  }}
                >
                  <ToggleGroupItem value="kiri">
                    {teks.ttd.kiri}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="tengah">
                    {teks.ttd.tengah}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="kanan">
                    {teks.ttd.kanan}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            <div>
              <Button
                type="button"
                onClick={proses}
                disabled={!dataUrl || sedangProses}
              >
                {sedangProses ? teks.ttd.memproses : teks.ttd.proses}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{teks.ttd.catatan}</p>
          </div>
        </>
      ) : null}

      {galat ? <p className="mt-3 text-sm text-destructive">{galat}</p> : null}

      {hasil ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{teks.ttd.hasil}</CardTitle>
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
