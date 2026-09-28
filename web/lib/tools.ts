export type Proses = "browser" | "server";
export type StatusAlat = "tersedia" | "segera";

export type Alat = {
  slug: string;
  nama: string;
  deskripsi: string;
  proses: Proses;
  status: StatusAlat;
};

export const ALAT: readonly Alat[] = [
  {
    slug: "gabung-pdf",
    nama: "Gabung PDF",
    deskripsi: "Satukan beberapa file PDF menjadi satu dokumen.",
    proses: "browser",
    status: "segera",
  },
  {
    slug: "pisah-pdf",
    nama: "Pisah PDF",
    deskripsi: "Ambil halaman tertentu atau pecah PDF menjadi beberapa file.",
    proses: "browser",
    status: "segera",
  },
  {
    slug: "pdf-ke-gambar",
    nama: "PDF ke JPG/PNG",
    deskripsi: "Ubah tiap halaman PDF menjadi gambar JPG atau PNG.",
    proses: "browser",
    status: "segera",
  },
  {
    slug: "gambar-ke-pdf",
    nama: "JPG/PNG ke PDF",
    deskripsi: "Susun beberapa gambar menjadi satu file PDF.",
    proses: "browser",
    status: "segera",
  },
  {
    slug: "kompres-gambar",
    nama: "Kompres gambar",
    deskripsi: "Kecilkan ukuran foto agar lolos batas unggahan pendaftaran.",
    proses: "browser",
    status: "tersedia",
  },
  {
    slug: "konversi-gambar",
    nama: "Konversi format gambar",
    deskripsi: "Ubah gambar antara format JPG, PNG, dan WebP.",
    proses: "browser",
    status: "segera",
  },
];
