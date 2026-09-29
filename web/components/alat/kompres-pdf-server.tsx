"use client";

import { useState } from "react";

import { AlatServer } from "@/components/alat/alat-server";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { teks } from "@/lib/i18n";
import { EKSTENSI_PDF } from "@/lib/pdf";

const PRESET = ["printer", "ebook", "screen"] as const;

export function AlatKompresPdfServer() {
  const [preset, setPreset] = useState<string>("ebook");
  const [target, setTarget] = useState("");

  const targetKb = Number(target);
  const pakaiTarget =
    target.trim() !== "" && Number.isFinite(targetKb) && targetKb > 0;
  const params: Record<string, string> = pakaiTarget
    ? { target_kb: String(Math.round(targetKb)) }
    : { preset };

  return (
    <AlatServer
      jalur="/api/v1/convert/compress-pdf"
      terima={EKSTENSI_PDF}
      params={params}
    >
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <span className="text-sm">{teks.server.preset}</span>
        <ToggleGroup
          type="single"
          variant="outline"
          value={preset}
          onValueChange={(nilai) => {
            if (nilai) setPreset(nilai);
          }}
        >
          {PRESET.map((nilai) => (
            <ToggleGroupItem key={nilai} value={nilai}>
              {nilai}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="grid gap-2">
          <Label htmlFor="target">{teks.server.targetKb}</Label>
          <Input
            id="target"
            inputMode="numeric"
            className="w-36"
            placeholder="500"
            value={target}
            onChange={(peristiwa) => setTarget(peristiwa.target.value)}
          />
        </div>
      </div>
    </AlatServer>
  );
}
