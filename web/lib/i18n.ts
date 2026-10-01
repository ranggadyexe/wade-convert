export const teks = {
  namaSitus: "Wade Convert",
  tagline: "Konversi file cepat, gratis, dan privat",
  deskripsi:
    "Toolkit konversi PDF dan gambar. Sebagian besar alat diproses langsung di browser, jadi filemu tidak perlu diunggah.",
  daftarAlat: "Alat yang Didukung",
  daftarAlatDeskripsi:
    "Semua alat di bawah ini berjalan langsung di browser — filemu tidak diunggah. Tool berat seperti OCR dan PDF ke Markdown menyusul.",
  labelBrowser: "Diproses di browser",
  labelServer: "Diproses di server",
  server: {
    proses: "Proses",
    memproses: "Memproses...",
    gagal: "Gagal memproses file",
    tidakTerhubung: "Tidak bisa menghubungi server",
    catatan: "File diunggah ke server dan dihapus otomatis setelah 15 menit.",
    preset: "Kualitas",
    targetKb: "Target ukuran (KB, opsional)",
  },
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
  privasi: {
    judul: "Kebijakan Privasi",
    draf: "Draf — belum ditinjau penasihat hukum.",
    diperbarui: "Terakhir diperbarui: 1 Oktober 2026",
    bagian: [
      {
        judul: "Ringkasan",
        isi: [
          "Wade Convert tidak memakai akun, tidak menampilkan iklan, dan tidak menjual atau menambang data pengguna.",
        ],
      },
      {
        judul: "File yang diproses di browser",
        isi: [
          "Sebagian besar alat berjalan sepenuhnya di perangkatmu. File untuk alat tersebut tidak pernah dikirim ke server kami.",
        ],
      },
      {
        judul: "File untuk alat server",
        isi: [
          "Alat berat (seperti OCR, PDF ke Markdown, dan kompres PDF) mengunggah file ke server kami untuk diproses. File tersebut dihapus otomatis setelah batas waktu penyimpanan sementara (default 15 menit) dan tidak dipakai untuk keperluan lain.",
        ],
      },
      {
        judul: "Log server",
        isi: [
          "Server mencatat alamat IP dan waktu permintaan untuk membatasi penyalahgunaan (rate limit) dan menjaga keamanan layanan. Log ini tidak dipakai untuk membuat profil pengguna.",
        ],
      },
      {
        judul: "Data di perangkatmu",
        isi: [
          "Preferensi tema terang/gelap disimpan di penyimpanan lokal browser. Kami tidak memakai cookie pelacak maupun analitik pihak ketiga.",
        ],
      },
      {
        judul: "Kode terbuka dan kontak",
        isi: [
          "Proyek ini open source dengan lisensi AGPL-3.0, sehingga siapa pun dapat mengaudit cara kerjanya.",
          "Pertanyaan tentang privasi bisa dikirim lewat halaman Kontak.",
        ],
      },
    ],
  },
  syarat: {
    judul: "Syarat dan Ketentuan",
    draf: "Draf — belum ditinjau penasihat hukum.",
    diperbarui: "Terakhir diperbarui: 1 Oktober 2026",
    bagian: [
      {
        judul: "Layanan",
        isi: [
          "Wade Convert disediakan gratis dan apa adanya (as is), tanpa jaminan dalam bentuk apa pun.",
        ],
      },
      {
        judul: "Batasan penggunaan",
        isi: [
          "Ukuran file maksimum 20 MB per file, PDF maksimum 100 halaman, dan ada pembatasan jumlah permintaan per alamat IP. Batasan dapat berubah sewaktu-waktu.",
        ],
      },
      {
        judul: "Tanggung jawab pengguna",
        isi: [
          "Kamu hanya boleh mengunggah file yang kamu berhak memprosesnya. Dilarang memakai layanan ini untuk konten ilegal atau merugikan pihak lain.",
        ],
      },
      {
        judul: "File dan privasi",
        isi: [
          "File untuk alat server dihapus otomatis sesuai Kebijakan Privasi. Untuk dokumen yang sangat sensitif, gunakan alat yang diproses di browser bila memungkinkan.",
        ],
      },
      {
        judul: "Ketersediaan",
        isi: [
          "Layanan dapat berubah, dibatasi, atau dihentikan kapan saja, terutama untuk alat yang membutuhkan server.",
        ],
      },
      {
        judul: "Lisensi",
        isi: [
          "Kode sumber dilisensikan AGPL-3.0. Siapa pun yang menjalankan versi modifikasi sebagai layanan publik wajib membuka kode sumbernya.",
        ],
      },
      {
        judul: "Perubahan dan kontak",
        isi: [
          "Syarat ini dapat diperbarui sewaktu-waktu; tanggal pembaruan tercantum di halaman ini. Pertanyaan bisa dikirim lewat halaman Kontak.",
        ],
      },
    ],
  },
  resize: {
    preset: "Pilih ukuran",
    proses: "Ubah ukuran",
    memproses: "Memproses...",
    gagal: "Gagal mengubah ukuran gambar",
    catatan:
      "Ukuran mengikuti ketentuan umum pendaftaran. Selalu cek panduan resmi terbaru dari instansi tujuan.",
  },
  exif: {
    proses: "Bersihkan metadata",
    memproses: "Membersihkan...",
    gagal: "Gagal membersihkan metadata",
    hasil: (jumlah: number, adaGps: boolean) =>
      adaGps
        ? `${jumlah} field metadata dihapus, termasuk data lokasi GPS.`
        : `${jumlah} field metadata dihapus.`,
    tidakAda:
      "Tidak ada metadata yang terdeteksi; file tetap ditulis ulang tanpa metadata.",
    catatan:
      "Metadata kamera, tanggal, dan GPS dibuang dengan menulis ulang gambar langsung di browser.",
  },
  urut: {
    proses: "Simpan PDF",
    memproses: "Menyimpan...",
    gagal: "Gagal menyusun PDF",
    putar: "Putar halaman",
    keKiri: "Geser halaman ke kiri",
    keKanan: "Geser halaman ke kanan",
    hasil: "Hasil PDF",
    catatan: "Urutan chip mengikuti urutan halaman pada hasil.",
  },
  footerCatatan: "Open source berlisensi AGPL-3.0. Tanpa akun dan tanpa iklan.",
  hakCipta: "© 2026 Rangga Dewa Yudhistira",
  dibuatDi: "Made in Cibubur, Indonesia",
  footerPrivasi: "Privasi",
  footerSyarat: "Syarat",
  kontakFooter: "Contact Us",
  kontak: {
    judul: "Hubungi Kami",
    deskripsi:
      "Ada masukan, pertanyaan, atau ingin bekerja sama? Kirim pesan lewat form ini.",
    judulForm: "Tulis pesan",
    catatan:
      "Tombol kirim akan membuka aplikasi email di perangkatmu — tidak ada data yang dikirim ke server kami.",
    nama: "Nama",
    email: "Email (opsional)",
    pesan: "Pesan",
    kirim: "Buka aplikasi email",
    wajibIsi: "Nama dan pesan wajib diisi.",
    emailTidakValid: "Format email tidak valid.",
  },
} as const;

export const kamus = { id: teks } as const;

export type Locale = keyof typeof kamus;
