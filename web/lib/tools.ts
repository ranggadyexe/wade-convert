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
    status: "tersedia",
  },
  {
    slug: "pisah-pdf",
    nama: "Pisah PDF",
    deskripsi: "Ambil halaman tertentu dari PDF menjadi file baru.",
    proses: "browser",
    status: "tersedia",
  },
  {
    slug: "urut-pdf",
    nama: "Putar & urutkan PDF",
    deskripsi: "Putar halaman dan atur ulang urutannya sebelum disimpan.",
    proses: "browser",
    status: "tersedia",
  },
  {
    slug: "ttd-pdf",
    nama: "Tanda tangan PDF",
    deskripsi: "Gambar tanda tangan lalu tempel ke halaman PDF.",
    proses: "browser",
    status: "tersedia",
  },
  {
    slug: "pdf-ke-gambar",
    nama: "PDF ke JPG/PNG",
    deskripsi: "Ubah tiap halaman PDF menjadi gambar JPG atau PNG.",
    proses: "browser",
    status: "tersedia",
  },
  {
    slug: "gambar-ke-pdf",
    nama: "JPG/PNG ke PDF",
    deskripsi: "Susun beberapa gambar menjadi satu file PDF.",
    proses: "browser",
    status: "tersedia",
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
    status: "tersedia",
  },
  {
    slug: "resize-gambar",
    nama: "Resize (pas foto)",
    deskripsi: "Ubah ukuran foto sesuai preset pas foto, CPNS, atau SNBP.",
    proses: "browser",
    status: "tersedia",
  },
  {
    slug: "hapus-exif",
    nama: "Hapus metadata (EXIF)",
    deskripsi: "Bersihkan metadata kamera dan lokasi GPS dari foto.",
    proses: "browser",
    status: "tersedia",
  },
  {
    slug: "pdf-ke-markdown",
    nama: "PDF ke Markdown",
    deskripsi: "Ubah PDF menjadi teks atau Markdown.",
    proses: "server",
    status: "tersedia",
  },
  {
    slug: "ocr",
    nama: "OCR (scan ke teks)",
    deskripsi: "Ambil teks dari hasil scan berupa gambar atau PDF.",
    proses: "server",
    status: "tersedia",
  },
  {
    slug: "kompres-pdf",
    nama: "Kompres PDF",
    deskripsi: "Kecilkan ukuran PDF, bisa dengan target ukuran tertentu.",
    proses: "server",
    status: "tersedia",
  },
];
