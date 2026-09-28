import { PDFDocument } from "pdf-lib";

export const EKSTENSI_PDF = [".pdf"] as const;
export const MAKS_HALAMAN = 100;

export async function muatPdf(berkas: File): Promise<PDFDocument> {
  const dokumen = await PDFDocument.load(await berkas.arrayBuffer(), {
    ignoreEncryption: true,
  });
  if (dokumen.getPageCount() > MAKS_HALAMAN) {
    throw new Error(`Melebihi batas ${MAKS_HALAMAN} halaman`);
  }
  return dokumen;
}
