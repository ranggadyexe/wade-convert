import Link from "next/link";

import { teks } from "@/lib/i18n";
import { ALAT, type Alat } from "@/lib/tools";

const KELAS_KARTU =
  "flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-slate-800 dark:bg-slate-900";

function IsiKartu({ alat }: { alat: Alat }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{alat.nama}</h3>
        {alat.status === "segera" ? (
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {teks.labelSegera}
          </span>
        ) : null}
      </div>
      <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
        {alat.deskripsi}
      </p>
      <p className="mt-4 text-xs font-medium text-emerald-700 dark:text-emerald-400">
        {teks.labelBrowser}
      </p>
    </>
  );
}

function KartuAlat({ alat }: { alat: Alat }) {
  if (alat.status === "tersedia") {
    return (
      <Link
        href={`/${alat.slug}`}
        className={`${KELAS_KARTU} hover:border-primary/60`}
      >
        <IsiKartu alat={alat} />
      </Link>
    );
  }
  return (
    <div className={KELAS_KARTU}>
      <IsiKartu alat={alat} />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {teks.tagline}
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          {teks.deskripsi}
        </p>
      </section>

      <section className="mt-12" aria-labelledby="daftar-alat">
        <h2 id="daftar-alat" className="text-lg font-semibold">
          {teks.daftarAlat}
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALAT.map((alat) => (
            <li key={alat.slug}>
              <KartuAlat alat={alat} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
