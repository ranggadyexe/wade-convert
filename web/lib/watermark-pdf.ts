import { StandardFonts, degrees, rgb } from "pdf-lib";

import { muatPdf } from "./pdf.ts";

export type PosisiWatermark = "tengah" | "atas" | "bawah";

export const UKURAN_DEFAULT = 48;
export const OPASITAS_DEFAULT = 0.15;
export const MARGIN_WATERMARK = 40;
export const SUDUT_DIAGONAL = 45;

export type TempatWatermark = {
  x: number;
  y: number;
  rotasi: number;
};

export function titikAsalTeks(
  lebarTeks: number,
  tinggiTeks: number,
  sudut: number,
  pusatX: number,
  pusatY: number,
): { x: number; y: number } {
  const radian = (sudut * Math.PI) / 180;
  const kosinus = Math.cos(radian);
  const sinus = Math.sin(radian);
  const geserX = (lebarTeks / 2) * kosinus - (tinggiTeks / 2) * sinus;
  const geserY = (lebarTeks / 2) * sinus + (tinggiTeks / 2) * kosinus;
  return { x: pusatX - geserX, y: pusatY - geserY };
}

export function hitungTempatWatermark(
  lebarHalaman: number,
  tinggiHalaman: number,
  lebarTeks: number,
  tinggiTeks: number,
  posisi: PosisiWatermark,
): TempatWatermark {
  if (posisi === "tengah") {
    const titik = titikAsalTeks(
      lebarTeks,
      tinggiTeks,
      SUDUT_DIAGONAL,
      lebarHalaman / 2,
      tinggiHalaman / 2,
    );
    return { ...titik, rotasi: SUDUT_DIAGONAL };
  }
  const y =
    posisi === "atas"
      ? tinggiHalaman - MARGIN_WATERMARK - tinggiTeks
      : MARGIN_WATERMARK;
  return { x: (lebarHalaman - lebarTeks) / 2, y, rotasi: 0 };
}

export function namaHasilWatermark(nama: string): string {
  const tanpaEkstensi = nama.replace(/\.[^.]+$/, "");
  return `${tanpaEkstensi}-watermark.pdf`;
}

export async function beriWatermark(
  berkas: File,
  opsi: {
    teks: string;
    ukuran?: number;
    opasitas?: number;
    posisi: PosisiWatermark;
  },
): Promise<Blob> {
  const teks = opsi.teks.trim();
  if (!teks) throw new Error("Teks watermark tidak boleh kosong");
  const ukuran = opsi.ukuran ?? UKURAN_DEFAULT;
  const opasitas = opsi.opasitas ?? OPASITAS_DEFAULT;

  const dokumen = await muatPdf(berkas);
  const font = await dokumen.embedFont(StandardFonts.Helvetica);
  const lebarTeks = font.widthOfTextAtSize(teks, ukuran);
  const tinggiTeks = ukuran;

  for (const halaman of dokumen.getPages()) {
    const { width, height } = halaman.getSize();
    const tempat = hitungTempatWatermark(
      width,
      height,
      lebarTeks,
      tinggiTeks,
      opsi.posisi,
    );
    halaman.drawText(teks, {
      x: tempat.x,
      y: tempat.y,
      size: ukuran,
      font,
      color: rgb(0.45, 0.45, 0.45),
      opacity: opasitas,
      rotate: degrees(tempat.rotasi),
    });
  }

  const bytes = await dokumen.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}
