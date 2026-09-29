import { teks } from "./i18n.ts";

export const BASE_API =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type HasilServer = {
  nama_hasil: string;
  url_unduh: string;
  ukuran_hasil?: number;
  jumlah_halaman?: number;
};

export function urlApi(jalur: string): string {
  const dasar = BASE_API.replace(/\/$/, "");
  return jalur.startsWith("/") ? `${dasar}${jalur}` : `${dasar}/${jalur}`;
}

export function unggahBerkas(
  berkas: File,
  jalur: string,
  opsi: {
    params?: Record<string, string>;
    onProgres?: (persen: number) => void;
  } = {},
): Promise<HasilServer> {
  return new Promise((selesai, gagal) => {
    const kueri = new URLSearchParams(opsi.params ?? {}).toString();
    const alamat = `${urlApi(jalur)}${kueri ? `?${kueri}` : ""}`;
    const data = new FormData();
    data.append("berkas", berkas);

    const permintaan = new XMLHttpRequest();
    permintaan.open("POST", alamat);
    permintaan.upload.onprogress = (peristiwa) => {
      if (peristiwa.lengthComputable && opsi.onProgres) {
        opsi.onProgres((peristiwa.loaded / peristiwa.total) * 100);
      }
    };
    permintaan.onload = () => {
      try {
        const jawaban = JSON.parse(permintaan.responseText) as HasilServer & {
          detail?: string;
        };
        if (permintaan.status >= 200 && permintaan.status < 300) {
          selesai(jawaban);
        } else {
          gagal(new Error(jawaban.detail ?? teks.server.gagal));
        }
      } catch {
        gagal(new Error(teks.server.gagal));
      }
    };
    permintaan.onerror = () => gagal(new Error(teks.server.tidakTerhubung));
    permintaan.send(data);
  });
}
