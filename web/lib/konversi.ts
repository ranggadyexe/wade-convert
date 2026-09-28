export type FormatKeluaran = "image/jpeg" | "image/png" | "image/webp";

export const FORMAT_KELUARAN: readonly {
  nilai: FormatKeluaran;
  label: string;
  ekstensi: string;
}[] = [
  { nilai: "image/jpeg", label: "JPG", ekstensi: ".jpg" },
  { nilai: "image/png", label: "PNG", ekstensi: ".png" },
  { nilai: "image/webp", label: "WebP", ekstensi: ".webp" },
];

export function namaHasilKonversi(nama: string, ekstensi: string): string {
  const tanpaEkstensi = nama.replace(/\.[^.]+$/, "");
  return `${tanpaEkstensi}${ekstensi}`;
}

export async function konversiGambar(
  berkas: File,
  format: FormatKeluaran,
  opsi: { kualitas?: number } = {},
): Promise<Blob> {
  const kualitas = opsi.kualitas ?? 0.92;
  const bitmap = await createImageBitmap(berkas);
  const kanvas = document.createElement("canvas");
  kanvas.width = bitmap.width;
  kanvas.height = bitmap.height;
  const konteks = kanvas.getContext("2d");
  if (!konteks) {
    bitmap.close();
    throw new Error("Kanvas tidak tersedia");
  }
  if (format !== "image/png") {
    konteks.fillStyle = "#ffffff";
    konteks.fillRect(0, 0, kanvas.width, kanvas.height);
  }
  konteks.drawImage(bitmap, 0, 0);
  bitmap.close();
  const hasil = await new Promise<Blob | null>((resolve) =>
    kanvas.toBlob(resolve, format, kualitas),
  );
  if (!hasil) throw new Error("Konversi gagal");
  return hasil;
}
