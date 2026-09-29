"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { teks } from "@/lib/i18n";
import { buatTautanMailto, emailValid } from "@/lib/kontak";

export function FormKontak() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pesan, setPesan] = useState("");
  const [galat, setGalat] = useState<string | null>(null);

  function kirim() {
    if (!nama.trim() || !pesan.trim()) {
      setGalat(teks.kontak.wajibIsi);
      return;
    }
    if (email.trim() && !emailValid(email.trim())) {
      setGalat(teks.kontak.emailTidakValid);
      return;
    }
    setGalat(null);
    window.location.href = buatTautanMailto({
      nama: nama.trim(),
      email: email.trim() || undefined,
      pesan: pesan.trim(),
    });
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        kirim();
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="nama">{teks.kontak.nama}</Label>
        <Input
          id="nama"
          value={nama}
          onChange={(event) => setNama(event.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">{teks.kontak.email}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pesan">{teks.kontak.pesan}</Label>
        <Textarea
          id="pesan"
          rows={6}
          value={pesan}
          onChange={(event) => setPesan(event.target.value)}
          required
        />
      </div>
      {galat ? <p className="text-sm text-destructive">{galat}</p> : null}
      <Button type="submit" className="w-fit">
        {teks.kontak.kirim}
      </Button>
    </form>
  );
}
