"use client";

import { formatUkuran, type ItemBerkas } from "@/lib/berkas";
import { teks } from "@/lib/i18n";

type Props = {
  daftar: readonly ItemBerkas[];
  onHapus?: (id: string) => void;
};

export function DaftarBerkas({ daftar, onHapus }: Props) {
  if (daftar.length === 0) return null;

  return (
    <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
      {daftar.map((item) => (
        <li key={item.id} className="flex items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.nama}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatUkuran(item.ukuran)}
              {item.ukuranHasil !== undefined
                ? ` → ${formatUkuran(item.ukuranHasil)}`
                : ""}{" "}
              · {teks.unggah.status[item.status]}
            </p>
            {item.status === "diproses" ? (
              <div
                role="progressbar"
                aria-valuenow={item.progres}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${item.progres}%` }}
                />
              </div>
            ) : null}
            {item.status === "gagal" && item.pesan ? (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {item.pesan}
              </p>
            ) : null}
          </div>

          {item.status === "selesai" && item.urlHasil ? (
            <a
              href={item.urlHasil}
              download={item.namaHasil ?? item.nama}
              className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              {teks.unggah.unduh}
            </a>
          ) : null}

          {onHapus && item.status !== "diproses" ? (
            <button
              type="button"
              onClick={() => onHapus(item.id)}
              className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {teks.unggah.hapus}
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
