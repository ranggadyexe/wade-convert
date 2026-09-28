"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { teks } from "@/lib/i18n";

export function TombolTema({ kunciTema }: { kunciTema: string }) {
  function ganti() {
    const gelap = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem(kunciTema, gelap ? "gelap" : "terang");
    } catch {
      // localStorage bisa diblokir; abaikan, tema tetap berlaku untuk sesi ini
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={ganti}
      aria-label={teks.gantiTema}
      title={teks.gantiTema}
    >
      <Moon className="dark:hidden" aria-hidden="true" />
      <Sun className="hidden dark:block" aria-hidden="true" />
    </Button>
  );
}
