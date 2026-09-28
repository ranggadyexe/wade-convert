"use client";

import { useRef, useState } from "react";

import { validasiBerkas } from "@/lib/berkas";
import { teks } from "@/lib/i18n";

type Props = {
  terima?: readonly string[];
  banyak?: boolean;
  maksMB?: number;
  onTambah: (berkas: File[]) => void;
};

export function DropzoneBerkas({
  terima,
  banyak = true,
  maksMB = 20,
  onTambah,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [seret, setSeret] = useState(false);
  const [kesalahan, setKesalahan] = useState<string[]>([]);

  function baca(daftar: File[]) {
    const valid: File[] = [];
    const tolak: string[] = [];
    for (const berkas of daftar) {
      const pesan = validasiBerkas(berkas, { maksMB, terima });
      if (pesan) tolak.push(`${berkas.name}: ${pesan}`);
      else valid.push(berkas);
    }
    setKesalahan(tolak);
    if (valid.length > 0) onTambah(banyak ? valid : valid.slice(0, 1));
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={teks.unggah.pilih}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setSeret(true);
        }}
        onDragLeave={() => setSeret(false)}
        onDrop={(event) => {
          event.preventDefault();
          setSeret(false);
          baca(Array.from(event.dataTransfer.files));
        }}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          seret
            ? "border-primary bg-primary/5"
            : "border-slate-300 hover:border-primary/60 dark:border-slate-700"
        }`}
      >
        <p className="font-medium">{teks.unggah.tarik}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {teks.unggah.batas(maksMB)}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={terima?.join(",")}
        multiple={banyak}
        className="hidden"
        onChange={(event) => {
          baca(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />

      {kesalahan.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm text-red-600 dark:text-red-400">
          {kesalahan.map((pesan) => (
            <li key={pesan}>{pesan}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
