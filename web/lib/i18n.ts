export const teks = {
  namaSitus: "Wade Convert",
  tagline: "Konversi file cepat, gratis, dan privat",
  deskripsi:
    "Toolkit konversi PDF dan gambar. Sebagian besar alat diproses langsung di browser, jadi filemu tidak perlu diunggah.",
  daftarAlat: "Alat yang tersedia",
  labelBrowser: "Diproses di browser",
  labelSegera: "Segera",
  gantiTema: "Ganti tema terang/gelap",
  footerCatatan: "Open source berlisensi AGPL-3.0. Tanpa akun dan tanpa iklan.",
} as const;

export const kamus = { id: teks } as const;

export type Locale = keyof typeof kamus;
