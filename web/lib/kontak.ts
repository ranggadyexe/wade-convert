export const EMAIL_KONTAK = "ranggadewa853@gmail.com";

export function emailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function buatTautanMailto(isi: {
  nama: string;
  email?: string;
  pesan: string;
}): string {
  const subjek = `Pesan dari ${isi.nama} - Wade Convert`;
  const badan = `${isi.pesan}\n\n--\n${isi.nama}${
    isi.email ? ` (${isi.email})` : ""
  }`;
  const params = new URLSearchParams({ subject: subjek, body: badan });
  return `mailto:${EMAIL_KONTAK}?${params.toString().replaceAll("+", "%20")}`;
}
