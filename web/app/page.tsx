import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { teks } from "@/lib/i18n";
import { ALAT, type Alat } from "@/lib/tools";

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

export default function Home() {
  return (
    <>
      <section className="max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {teks.tagline}
        </h1>
        <p className="mt-3 text-muted-foreground">{teks.deskripsi}</p>
      </section>

      <section className="mt-12" aria-labelledby="daftar-alat">
        <h2 id="daftar-alat" className="font-heading text-lg font-semibold">
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
