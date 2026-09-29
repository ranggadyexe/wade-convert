export const teks = {
  namaSitus: "Wade Convert",
  tagline: "Konversi file cepat, gratis, dan privat",
  deskripsi:
    "Toolkit konversi PDF dan gambar. Sebagian besar alat diproses langsung di browser, jadi filemu tidak perlu diunggah.",
  daftarAlat: "Alat yang Didukung",
  daftarAlatDeskripsi:
    "Semua alat di bawah ini berjalan langsung di browser — filemu tidak diunggah. Tool berat seperti OCR dan PDF ke Markdown menyusul.",
  labelBrowser: "Diproses di browser",
  labelSegera: "Segera",
  navAlat: "Alat",
  repoGitHub: "Repositori GitHub",
  hero: {
    ilustrasi: "Ilustrasi contoh konversi file dari PDF ke JPG",
  },
  pilih: {
    judul: "Pilih file untuk memulai",
    deskripsi:
      "File tidak diunggah ke server; pilih alat yang cocok di bawah ini.",
    saran: "Alat yang cocok untuk filemu:",
    tidakCocok: "Belum ada alat untuk tipe file ini.",
  },
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
  gabung: {
    proses: "Gabung",
    memproses: "Menggabung...",
    gagal: "Gagal menggabung PDF",
    hasil: "Hasil gabungan",
    urutan: "Urutan gabungan mengikuti urutan daftar.",
  },
  pisah: {
    rentang: "Halaman yang diambil",
    proses: "Pisah",
    memproses: "Memisah...",
    gagal: "Gagal memisah PDF",
    hasil: "Hasil",
  },
  jumlahHalaman: (jumlah: number) => `${jumlah} halaman`,
  keGambar: {
    skala: "Resolusi",
    proses: "Ubah ke gambar",
    memproses: "Merender...",
    gagal: "Gagal mengubah PDF",
    hasil: "Hasil",
  },
  kePdf: {
    proses: "Buat PDF",
    memproses: "Membuat...",
    gagal: "Gagal membuat PDF",
    hasil: "Hasil PDF",
    urutan: "Urutan halaman mengikuti urutan daftar.",
  },
  footerCatatan: "Open source berlisensi AGPL-3.0. Tanpa akun dan tanpa iklan.",
} as const;

export const kamus = { id: teks } as const;

export type Locale = keyof typeof kamus;
