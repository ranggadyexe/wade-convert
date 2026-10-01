export type RingkasanExif = {
  jumlahField: number;
  adaGps: boolean;
};

const FIELD_DITAMPILKAN = [
  "Make",
  "Model",
  "LensModel",
  "FNumber",
  "ExposureTime",
  "ISO",
  "DateTimeOriginal",
  "Software",
  "Artist",
  "Copyright",
  "Orientation",
  "GPSLatitude",
  "GPSLongitude",
] as const;

export function ringkasExif(
  data: Record<string, unknown> | null | undefined,
): RingkasanExif {
  if (!data) return { jumlahField: 0, adaGps: false };
  const hadir = FIELD_DITAMPILKAN.filter(
    (kunci) => data[kunci] !== undefined && data[kunci] !== null,
  );
  return {
    jumlahField: hadir.length,
    adaGps: hadir.some((kunci) => kunci.startsWith("GPS")),
  };
}

export async function bacaExif(
  berkas: File,
): Promise<Record<string, unknown> | null> {
  try {
    const exifr = await import("exifr");
    const data = await exifr.parse(berkas, true);
    return (data as Record<string, unknown> | undefined) ?? null;
  } catch {
    return null;
  }
}

export function namaHasilTanpaExif(nama: string): string {
  const cocok = /^(.*)\.([^.]+)$/.exec(nama);
  const dasar = cocok ? cocok[1] : nama;
  const ekstensi = cocok ? cocok[2].toLowerCase() : "jpg";
  const keluaran = ekstensi === "png" ? "png" : "jpg";
  return `${dasar}-tanpa-exif.${keluaran}`;
}

async function keBlob(
  kanvas: HTMLCanvasElement,
  tipe: string,
  kualitas?: number,
): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) =>
    kanvas.toBlob(resolve, tipe, kualitas),
  );
  if (!blob) throw new Error("Kompresi gagal");
  return blob;
}

export async function hapusExif(berkas: File): Promise<Blob> {
  const png = berkas.type === "image/png";
  const bitmap = await createImageBitmap(berkas);
  const kanvas = document.createElement("canvas");
  kanvas.width = bitmap.width;
  kanvas.height = bitmap.height;
  const konteks = kanvas.getContext("2d");
  if (!konteks) {
    bitmap.close();
    throw new Error("Kanvas tidak tersedia");
  }
  if (!png) {
    konteks.fillStyle = "#ffffff";
    konteks.fillRect(0, 0, kanvas.width, kanvas.height);
  }
  konteks.drawImage(bitmap, 0, 0);
  bitmap.close();
  return png ? keBlob(kanvas, "image/png") : keBlob(kanvas, "image/jpeg", 0.95);
}
