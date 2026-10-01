import { muatPdf } from "./pdf.ts";

export type Posisi = "kiri" | "tengah" | "kanan";

export type Tempat = {
  x: number;
  y: number;
  lebar: number;
  tinggi: number;
};

export const MARGIN_TTD = 40;
export const LEBAR_TTD_PERSEN = 0.25;

export function hitungTempat(
  lebarHalaman: number,
  tinggiHalaman: number,
  rasioTtd: number,
  posisi: Posisi,
): Tempat {
  const lebar = lebarHalaman * LEBAR_TTD_PERSEN;
  const tinggi = lebar * rasioTtd;
  const x =
    posisi === "kiri"
      ? MARGIN_TTD
      : posisi === "tengah"
        ? (lebarHalaman - lebar) / 2
        : lebarHalaman - MARGIN_TTD - lebar;
  return { x, y: MARGIN_TTD, lebar, tinggi };
}

export function namaHasilTtd(nama: string): string {
  const tanpaEkstensi = nama.replace(/\.[^.]+$/, "");
  return `${tanpaEkstensi}-ttd.pdf`;
}

export async function tempelTandaTangan(
  berkas: File,
  ttdDataUrl: string,
  opsi: { halaman: number; posisi: Posisi },
): Promise<Blob> {
  const dokumen = await muatPdf(berkas);
  const jumlah = dokumen.getPageCount();
  if (opsi.halaman < 1 || opsi.halaman > jumlah) {
    throw new Error(`Halaman harus antara 1 dan ${jumlah}`);
  }
  const gambar = await dokumen.embedPng(ttdDataUrl);
  const halaman = dokumen.getPage(opsi.halaman - 1);
  const { width, height } = halaman.getSize();
  const tempat = hitungTempat(
    width,
    height,
    gambar.height / gambar.width,
    opsi.posisi,
  );
  halaman.drawImage(gambar, {
    x: tempat.x,
    y: tempat.y,
    width: tempat.lebar,
    height: tempat.tinggi,
  });
  const bytes = await dokumen.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}
