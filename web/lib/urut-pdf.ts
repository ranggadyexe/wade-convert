import { PDFDocument, degrees } from "pdf-lib";

import { muatPdf } from "./pdf.ts";

export type Halaman = {
  asal: number;
  rotasi: number;
};

export function putar(sudut: number, tambahan: number): number {
  const total = (((sudut + tambahan) % 360) + 360) % 360;
  return Math.round(total / 90) * 90;
}

export function pindahItem<T>(
  daftar: readonly T[],
  dari: number,
  ke: number,
): T[] {
  const salinan = [...daftar];
  if (dari < 0 || dari >= salinan.length || ke < 0 || ke >= salinan.length) {
    return salinan;
  }
  const [item] = salinan.splice(dari, 1);
  salinan.splice(ke, 0, item);
  return salinan;
}

export function namaHasilUrut(nama: string): string {
  const tanpaEkstensi = nama.replace(/\.[^.]+$/, "");
  return `${tanpaEkstensi}-urut.pdf`;
}

export async function bacaJumlahHalaman(berkas: File): Promise<number> {
  const dokumen = await muatPdf(berkas);
  return dokumen.getPageCount();
}

export async function susunPdf(
  berkas: File,
  halaman: readonly Halaman[],
): Promise<Blob> {
  const sumber = await muatPdf(berkas);
  const hasil = await PDFDocument.create();
  for (const info of halaman) {
    const [disalin] = await hasil.copyPages(sumber, [info.asal]);
    disalin.setRotation(degrees(putar(0, info.rotasi)));
    hasil.addPage(disalin);
  }
  const bytes = await hasil.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}
