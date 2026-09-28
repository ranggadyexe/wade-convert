import { PDFDocument } from "pdf-lib";

export const EKSTENSI_PDF = [".pdf"] as const;
export const MAKS_HALAMAN = 100;

export type HasilGabung = {
  blob: Blob;
  jumlahHalaman: number;
};

export function namaHasilGabung(nama: string): string {
  const tanpaEkstensi = nama.replace(/\.[^.]+$/, "");
  return `${tanpaEkstensi}-gabung.pdf`;
}

export async function gabungPdf(berkas: readonly File[]): Promise<HasilGabung> {
  const hasil = await PDFDocument.create();
  let jumlahHalaman = 0;
  for (const file of berkas) {
    const dokumen = await PDFDocument.load(await file.arrayBuffer(), {
      ignoreEncryption: true,
    });
    const halaman = await hasil.copyPages(dokumen, dokumen.getPageIndices());
    for (const h of halaman) hasil.addPage(h);
    jumlahHalaman += halaman.length;
    if (jumlahHalaman > MAKS_HALAMAN) {
      throw new Error(`Melebihi batas ${MAKS_HALAMAN} halaman`);
    }
  }
  const bytes = await hasil.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    jumlahHalaman,
  };
}
