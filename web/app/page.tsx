import { EyeOff, FileImage, FileText, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { PilihBerkas } from "@/components/pilih-berkas";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { teks } from "@/lib/i18n";
import { ALAT, type Alat } from "@/lib/tools";

function IlustrasiKonversi() {
  return (
    <div
      role="img"
      aria-label={teks.hero.ilustrasi}
      className="flex items-center justify-center gap-3"
    >
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
        <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm font-medium">PDF</span>
      </div>
      <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
        TO
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-primary/40 bg-card px-3 py-2 shadow-sm">
        <FileImage className="size-4 text-primary" aria-hidden="true" />
        <span className="text-sm font-medium">JPG</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="grid items-center gap-8 py-6 sm:grid-cols-[1fr_auto] sm:py-12">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {teks.tagline}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{teks.deskripsi}</p>
      </div>
      <IlustrasiKonversi />
    </section>
  );
}

function IsiKartu({ alat }: { alat: Alat }) {
  return (
    <Card className="h-full transition hover:ring-primary/40">
      <CardHeader>
        <CardTitle>{alat.nama}</CardTitle>
        {alat.status === "segera" ? (
          <CardAction>
            <Badge variant="secondary">{teks.labelSegera}</Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-3">
        <p className="text-muted-foreground">{alat.deskripsi}</p>
        <p className="text-xs font-medium text-primary">{teks.labelBrowser}</p>
      </CardContent>
    </Card>
  );
}

function KartuAlat({ alat }: { alat: Alat }) {
  if (alat.status === "tersedia") {
    return (
      <Link href={`/${alat.slug}`} className="block h-full">
        <IsiKartu alat={alat} />
      </Link>
    );
  }
  return <IsiKartu alat={alat} />;
}

const IKON_KEAMANAN = [ShieldCheck, Trash2, EyeOff];

function KeamananData() {
  return (
    <section className="mt-14" aria-labelledby="keamanan-data">
      <h2
        id="keamanan-data"
        className="font-heading text-2xl font-bold tracking-tight"
      >
        {teks.keamanan.judul}
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {teks.keamanan.deskripsi}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {teks.keamanan.poin.map((poin, indeks) => {
          const Ikon = IKON_KEAMANAN[indeks];
          return (
            <Card key={poin.judul}>
              <CardHeader>
                <Ikon className="size-5 text-primary" aria-hidden="true" />
                <CardTitle>{poin.judul}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{poin.isi}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mt-6">
        <PilihBerkas />
      </section>

      <section className="mt-14" aria-labelledby="daftar-alat">
        <h2
          id="daftar-alat"
          className="font-heading text-2xl font-bold tracking-tight"
        >
          {teks.daftarAlat}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {teks.daftarAlatDeskripsi}
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALAT.map((alat) => (
            <li key={alat.slug}>
              <KartuAlat alat={alat} />
            </li>
          ))}
        </ul>
      </section>

      <KeamananData />
    </>
  );
}
