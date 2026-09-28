"use client";

import { Moon, Sun } from "lucide-react";

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
    <button
      type="button"
      onClick={ganti}
      aria-label={teks.gantiTema}
      title={teks.gantiTema}
      className="rounded-lg border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </button>
  );
}
