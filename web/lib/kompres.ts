export const EKSTENSI_GAMBAR = [".jpg", ".jpeg", ".png", ".webp"] as const;

export const KUALITAS_DEFAULT = 0.8;

export function namaHasilKompres(nama: string): string {
  const tanpaEkstensi = nama.replace(/\.[^.]+$/, "");
  return `${tanpaEkstensi}-kompres.jpg`;
}

export async function kompresGambar(
  berkas: File,
  opsi: { kualitas?: number } = {},
): Promise<Blob> {
  const kualitas = opsi.kualitas ?? KUALITAS_DEFAULT;
  const bitmap = await createImageBitmap(berkas);
  const kanvas = document.createElement("canvas");
  kanvas.width = bitmap.width;
  kanvas.height = bitmap.height;
  const konteks = kanvas.getContext("2d");
  if (!konteks) {
    bitmap.close();
    throw new Error("Kanvas tidak tersedia");
  }
  konteks.fillStyle = "#ffffff";
  konteks.fillRect(0, 0, kanvas.width, kanvas.height);
  konteks.drawImage(bitmap, 0, 0);
  bitmap.close();
  const hasil = await new Promise<Blob | null>((resolve) =>
    kanvas.toBlob(resolve, "image/jpeg", kualitas),
  );
  if (!hasil) throw new Error("Kompresi gagal");
  return hasil;
}
