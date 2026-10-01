export type Preset = {
  slug: string;
  nama: string;
  lebar: number;
  tinggi: number;
  maksKb?: number;
};

export const PRESET: readonly Preset[] = [
  { slug: "pas-foto-2x3", nama: "Pas Foto 2×3", lebar: 236, tinggi: 354 },
  { slug: "pas-foto-3x4", nama: "Pas Foto 3×4", lebar: 354, tinggi: 472 },
  { slug: "pas-foto-4x6", nama: "Pas Foto 4×6", lebar: 472, tinggi: 709 },
  {
    slug: "cpns-3x4",
    nama: "CPNS 3×4 (maks 200 KB)",
    lebar: 354,
    tinggi: 472,
    maksKb: 200,
  },
  {
    slug: "snbp-3x4",
    nama: "SNBP 3×4 (maks 100 KB)",
    lebar: 354,
    tinggi: 472,
    maksKb: 100,
  },
];

export type AreaPotong = {
  sx: number;
  sy: number;
  lebar: number;
  tinggi: number;
};

export function hitungPotong(
  lebarAsal: number,
  tinggiAsal: number,
  lebarTarget: number,
  tinggiTarget: number,
): AreaPotong {
  const skala = Math.max(lebarTarget / lebarAsal, tinggiTarget / tinggiAsal);
  const lebar = lebarTarget / skala;
  const tinggi = tinggiTarget / skala;
  return {
    sx: Math.round((lebarAsal - lebar) / 2),
    sy: Math.round((tinggiAsal - tinggi) / 2),
    lebar: Math.round(lebar),
    tinggi: Math.round(tinggi),
  };
}

export function namaHasilResize(nama: string, preset: Preset): string {
  const tanpaEkstensi = nama.replace(/\.[^.]+$/, "");
  return `${tanpaEkstensi}-${preset.slug}.jpg`;
}

async function keBlob(kanvas: HTMLCanvasElement, kualitas: number) {
  const blob = await new Promise<Blob | null>((resolve) =>
    kanvas.toBlob(resolve, "image/jpeg", kualitas),
  );
  if (!blob) throw new Error("Kompresi gagal");
  return blob;
}

export async function resizeGambar(
  berkas: File,
  preset: Preset,
): Promise<Blob> {
  const bitmap = await createImageBitmap(berkas);
  const kanvas = document.createElement("canvas");
  kanvas.width = preset.lebar;
  kanvas.height = preset.tinggi;
  const konteks = kanvas.getContext("2d");
  if (!konteks) {
    bitmap.close();
    throw new Error("Kanvas tidak tersedia");
  }
  konteks.fillStyle = "#ffffff";
  konteks.fillRect(0, 0, preset.lebar, preset.tinggi);
  const potong = hitungPotong(
    bitmap.width,
    bitmap.height,
    preset.lebar,
    preset.tinggi,
  );
  konteks.drawImage(
    bitmap,
    potong.sx,
    potong.sy,
    potong.lebar,
    potong.tinggi,
    0,
    0,
    preset.lebar,
    preset.tinggi,
  );
  bitmap.close();

  let kualitas = 0.92;
  let blob = await keBlob(kanvas, kualitas);
  if (!preset.maksKb) return blob;
  while (blob.size > preset.maksKb * 1024 && kualitas > 0.4) {
    kualitas = Math.max(0.4, kualitas - 0.07);
    blob = await keBlob(kanvas, kualitas);
  }
  return blob;
}
