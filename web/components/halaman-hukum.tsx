import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Bagian = { judul: string; isi: readonly string[] };

export function HalamanHukum({
  judul,
  draf,
  diperbarui,
  bagian,
}: {
  judul: string;
  draf: string;
  diperbarui: string;
  bagian: readonly Bagian[];
}) {
  return (
    <>
      <section className="max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {judul}
        </h1>
        <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
          {draf}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{diperbarui}</p>
      </section>

      <div className="mt-8 grid max-w-2xl gap-4">
        {bagian.map((butir) => (
          <Card key={butir.judul}>
            <CardHeader>
              <CardTitle>{butir.judul}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {butir.isi.map((paragraf) => (
                <p key={paragraf} className="text-sm text-muted-foreground">
                  {paragraf}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
