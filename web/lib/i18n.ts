export const teks = {
  namaSitus: "Wade Convert",
  tagline: "Konversi file cepat, gratis, dan privat",
  deskripsi:
    "Toolkit konversi PDF dan gambar. Sebagian besar alat diproses langsung di browser, jadi filemu tidak perlu diunggah.",
  daftarAlat: "Alat yang tersedia",
  labelBrowser: "Diproses di browser",
  labelSegera: "Segera",
  gantiTema: "Ganti tema terang/gelap",
  unggah: {
    tarik: "Tarik file ke sini atau klik untuk memilih",
    pilih: "Pilih file",
    batas: (maksMB: number) => `Maksimum ${maksMB} MB per file`,
    unduh: "Unduh",
    hapus: "Hapus",
    status: {
      menunggu: "Menunggu",
      diproses: "Diproses...",
      selesai: "Selesai",
      gagal: "Gagal",
    },
  },
  kompres: {
    kualitas: "Kualitas",
    proses: "Kompres",
    memproses: "Memproses...",
    gagal: "Gagal mengompres gambar",
  },
  konversi: {
    format: "Format keluaran",
    proses: "Konversi",
    memproses: "Memproses...",
    gagal: "Gagal mengonversi gambar",
  },
  footerCatatan: "Open source berlisensi AGPL-3.0. Tanpa akun dan tanpa iklan.",
} as const;

export const kamus = { id: teks } as const;

export type Locale = keyof typeof kamus;
