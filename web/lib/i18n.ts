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
  keamanan: {
    judul: "Keamanan Data",
    deskripsi:
      "Privasi file adalah alasan utama proyek ini dibuat — bukan sekadar tambahan.",
    poin: [
      {
        judul: "Diproses di browser",
        isi: "File tidak diunggah; konversi berjalan di perangkatmu sendiri.",
      },
      {
        judul: "Auto-hapus di server",
        isi: "Tool berat menghapus file otomatis setelah 15 menit (TTL).",
      },
      {
        judul: "Tanpa jual data",
        isi: "Tidak ada pelacakan iklan; file tidak dijual atau ditambang.",
      },
    ],
  },
  kualitas: {
    judul: "Kualitas Konversi",
    deskripsi:
      "Mesin dipilih sesuai jenis berkas, bukan satu alat untuk semua.",
    poin: [
      {
        judul: "Mesin open-source terpilih",
        isi: "pdf-lib, pdf.js, PyMuPDF4LLM, dan Tesseract dipakai sesuai tipe berkas.",
      },
      {
        judul: "Kontrol kompresi",
        isi: "Atur kualitas dan ukuran hasil sesuai kebutuhan, misalnya syarat unggah pendaftaran.",
      },
      {
        judul: "Hasil akurat",
        isi: "Teks, gambar, dan tata letak dipertahankan semaksimal mungkin.",
      },
    ],
  },
  footerCatatan: "Open source berlisensi AGPL-3.0. Tanpa akun dan tanpa iklan.",
  hakCipta: "© 2026 Rangga Dewa Yudhistira",
  dibuatDi: "Made in Cibubur, Indonesia",
  kontak: "Contact Us",
} as const;

export const kamus = { id: teks } as const;

export type Locale = keyof typeof kamus;
