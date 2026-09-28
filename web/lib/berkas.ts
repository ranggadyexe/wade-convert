export type StatusBerkas = "menunggu" | "diproses" | "selesai" | "gagal";

export type ItemBerkas = {
  id: string;
  nama: string;
  ukuran: number;
  status: StatusBerkas;
  progres: number;
  urlHasil?: string;
  namaHasil?: string;
  pesan?: string;
};

export type BerkasRingkas = Pick<File, "name" | "size" | "type">;

export function formatUkuran(byte: number): string {
  if (byte < 1024) return `${byte} B`;
  const kb = byte / 1024;
  if (kb < 1024) return `${formatAngka(kb)} KB`;
  return `${formatAngka(kb / 1024)} MB`;
}

export function validasiBerkas(
  berkas: BerkasRingkas,
  opsi: { maksMB?: number; terima?: readonly string[] },
): string | null {
  const maksMB = opsi.maksMB ?? 20;
  if (berkas.size > maksMB * 1024 * 1024) {
    return `Ukuran melebihi batas ${maksMB} MB`;
  }
  if (opsi.terima && opsi.terima.length > 0) {
    const nama = berkas.name.toLowerCase();
    const cocok = opsi.terima.some((ext) => nama.endsWith(ext.toLowerCase()));
    if (!cocok) return `Format tidak didukung (${opsi.terima.join(", ")})`;
  }
  return null;
}

export function buatItem(berkas: BerkasRingkas, id: string): ItemBerkas {
  return {
    id,
    nama: berkas.name,
    ukuran: berkas.size,
    status: "menunggu",
    progres: 0,
  };
}

function formatAngka(n: number): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(n);
}
