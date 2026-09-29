import { PDFDocument } from "pdf-lib";

import { MAKS_HALAMAN } from "./pdf.ts";

export const EKSTENSI_KE_PDF = [".jpg", ".jpeg", ".png"] as const;

const A4 = { lebar: 595.28, tinggi: 841.89 };
const MARGIN = 24;

export type HasilGambarKePdf = {
  blob: Blob;
  jumlahHalaman: number;
};

export function namaHasilGambarKePdf(nama: string): string {
  const tanpaEkstensi = nama.replace(/\.[^.]+$/, "");
  return `${tanpaEkstensi}.pdf`;
}

export async function gambarKePdf(
  berkas: readonly File[],
): Promise<HasilGambarKePdf> {
  if (berkas.length > MAKS_HALAMAN) {
    throw new Error(`Melebihi batas ${MAKS_HALAMAN} halaman`);
  }
  const dokumen = await PDFDocument.create();
  for (const file of berkas) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const png =
      file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
    const gambar = png
      ? await dokumen.embedPng(bytes)
      : await dokumen.embedJpg(bytes);
    const halaman = dokumen.addPage([A4.lebar, A4.tinggi]);
    const skala = Math.min(
      (A4.lebar - MARGIN * 2) / gambar.width,
      (A4.tinggi - MARGIN * 2) / gambar.height,
    );
    const lebar = gambar.width * skala;
    const tinggi = gambar.height * skala;
    halaman.drawImage(gambar, {
      x: (A4.lebar - lebar) / 2,
      y: (A4.tinggi - tinggi) / 2,
      width: lebar,
      height: tinggi,
    });
  }
  const bytes = await dokumen.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    jumlahHalaman: berkas.length,
  };
}
