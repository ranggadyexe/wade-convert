import { EKSTENSI_GAMBAR } from "./kompres.ts";
import { EKSTENSI_PDF } from "./pdf.ts";
import { ALAT } from "./tools.ts";

type Jenis = "pdf" | "gambar";

const SARAN: Record<Jenis, readonly string[]> = {
  pdf: [
    "gabung-pdf",
    "pisah-pdf",
    "pdf-ke-gambar",
    "pdf-ke-markdown",
    "kompres-pdf",
    "ocr",
  ],
  gambar: [
    "kompres-gambar",
    "konversi-gambar",
    "gambar-ke-pdf",
    "resize-gambar",
    "hapus-exif",
    "ocr",
  ],
};

function jenisBerkas(nama: string): Jenis | null {
  const rendah = nama.toLowerCase();
  if (EKSTENSI_PDF.some((ext) => rendah.endsWith(ext))) return "pdf";
  if (EKSTENSI_GAMBAR.some((ext) => rendah.endsWith(ext))) return "gambar";
  return null;
}

export function saranAlat(namaBerkas: readonly string[]): string[] {
  const jenis = new Set(
    namaBerkas
      .map(jenisBerkas)
      .filter((nilai): nilai is Jenis => nilai !== null),
  );
  const urutan: string[] = [];
  for (const kandidat of ["pdf", "gambar"] as const) {
    if (jenis.has(kandidat)) urutan.push(...SARAN[kandidat]);
  }
  const tersedia = new Set(
    ALAT.filter((alat) => alat.status === "tersedia").map((alat) => alat.slug),
  );
  return [...new Set(urutan)].filter((slug) => tersedia.has(slug));
}
