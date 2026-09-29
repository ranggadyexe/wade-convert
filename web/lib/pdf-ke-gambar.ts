import { MAKS_HALAMAN } from "./pdf.ts";

export type FormatHalaman = "image/png" | "image/jpeg";
export type Skala = "1" | "2" | "3";

export type HasilHalaman = {
  nama: string;
  blob: Blob;
};

export function namaHasilHalaman(
  namaPdf: string,
  halaman: number,
  ekstensi: string,
): string {
  const tanpaEkstensi = namaPdf.replace(/\.[^.]+$/, "");
  return `${tanpaEkstensi}-hal-${halaman}${ekstensi}`;
}

export async function renderHalaman(
  berkas: File,
  opsi: { format: FormatHalaman; skala?: Skala; halaman?: readonly number[] },
): Promise<HasilHalaman[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const data = new Uint8Array(await berkas.arrayBuffer());
  const tugas = pdfjs.getDocument({ data });
  const dokumen = await tugas.promise;
  try {
    if (dokumen.numPages > MAKS_HALAMAN) {
      throw new Error(`Melebihi batas ${MAKS_HALAMAN} halaman`);
    }
    const skala = Number(opsi.skala ?? "2");
    const ekstensi = opsi.format === "image/png" ? ".png" : ".jpg";
    const nomor =
      opsi.halaman ??
      Array.from({ length: dokumen.numPages }, (_, indeks) => indeks + 1);
    const hasil: HasilHalaman[] = [];
    for (const nomorHalaman of nomor) {
      const halaman = await dokumen.getPage(nomorHalaman);
      const viewport = halaman.getViewport({ scale: skala });
      const kanvas = document.createElement("canvas");
      kanvas.width = Math.ceil(viewport.width);
      kanvas.height = Math.ceil(viewport.height);
      const konteks = kanvas.getContext("2d");
      if (!konteks) throw new Error("Kanvas tidak tersedia");
      if (opsi.format === "image/jpeg") {
        konteks.fillStyle = "#ffffff";
        konteks.fillRect(0, 0, kanvas.width, kanvas.height);
      }
      await halaman.render({
        canvas: kanvas,
        canvasContext: konteks,
        viewport,
      }).promise;
      const blob = await new Promise<Blob | null>((resolve) =>
        kanvas.toBlob(resolve, opsi.format, 0.92),
      );
      if (!blob) throw new Error("Render gagal");
      hasil.push({
        nama: namaHasilHalaman(berkas.name, nomorHalaman, ekstensi),
        blob,
      });
    }
    return hasil;
  } finally {
    await tugas.destroy();
  }
}
