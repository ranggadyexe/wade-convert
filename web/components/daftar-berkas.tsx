"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatUkuran, type ItemBerkas } from "@/lib/berkas";
import { teks } from "@/lib/i18n";

type Props = {
  daftar: readonly ItemBerkas[];
  onHapus?: (id: string) => void;
};

export function DaftarBerkas({ daftar, onHapus }: Props) {
  if (daftar.length === 0) return null;

  return (
    <ul className="mt-4 divide-y divide-border">
      {daftar.map((item) => (
        <li key={item.id} className="flex items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.nama}</p>
            <p className="text-xs text-muted-foreground">
              {formatUkuran(item.ukuran)}
              {item.ukuranHasil !== undefined
                ? ` → ${formatUkuran(item.ukuranHasil)}`
                : ""}{" "}
              · {teks.unggah.status[item.status]}
            </p>
            {item.status === "diproses" ? (
              <Progress
                value={item.progres}
                aria-label={`${teks.unggah.status.diproses} ${item.nama}`}
                className="mt-2 h-1.5"
              />
            ) : null}
            {item.status === "gagal" && item.pesan ? (
              <p className="mt-1 text-xs text-destructive">{item.pesan}</p>
            ) : null}
          </div>

          {item.status === "selesai" && item.urlHasil ? (
            <Button asChild size="sm">
              <a href={item.urlHasil} download={item.namaHasil ?? item.nama}>
                {teks.unggah.unduh}
              </a>
            </Button>
          ) : null}

          {onHapus && item.status !== "diproses" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onHapus(item.id)}
            >
              {teks.unggah.hapus}
            </Button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
