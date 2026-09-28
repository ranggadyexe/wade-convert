import { PDFDocument } from "pdf-lib";

import { muatPdf } from "./pdf.ts";

export type HasilPisah = {
  blob: Blob;
  jumlahHalaman: number;
};

export function parseRentang(teks: string, maksHalaman: number): number[] {
  const bersih = teks.trim();
  if (!bersih) throw new Error("Rentang halaman kosong");
  const indeks: number[] = [];
  for (const bagian of bersih.split(",")) {
    const potongan = bagian.trim();
    const cocok = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(potongan);
    if (!cocok) throw new Error(`Rentang tidak valid: ${potongan}`);
    const awal = Number(cocok[1]);
    const akhir = cocok[2] ? Number(cocok[2]) : awal;
    if (awal < 1 || akhir < 1) {
      throw new Error("Nomor halaman mulai dari 1");
    }
    if (awal > akhir) {
      throw new Error(`Rentang terbalik: ${potongan}`);
    }
    if (akhir > maksHalaman) {
      throw new Error(
        `Halaman ${akhir} melebihi jumlah halaman (${maksHalaman})`,
      );
    }
    for (let halaman = awal; halaman <= akhir; halaman++) {
      indeks.push(halaman - 1);
    }
  }
  return indeks;
}

export function namaHasilPisah(nama: string): string {
  const tanpaEkstensi = nama.replace(/\.[^.]+$/, "");
  return `${tanpaEkstensi}-pisah.pdf`;
}

export async function pisahPdf(
  berkas: File,
  indeks: readonly number[],
): Promise<HasilPisah> {
  const sumber = await muatPdf(berkas);
  const hasil = await PDFDocument.create();
  const halaman = await hasil.copyPages(sumber, [...indeks]);
  for (const h of halaman) hasil.addPage(h);
  const bytes = await hasil.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    jumlahHalaman: halaman.length,
  };
}
