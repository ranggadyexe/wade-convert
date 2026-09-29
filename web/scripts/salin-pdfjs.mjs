import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sumber = resolve(
  akar,
  "node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
);
const tujuan = resolve(akar, "public/pdf.worker.min.mjs");

if (existsSync(sumber)) {
  mkdirSync(dirname(tujuan), { recursive: true });
  copyFileSync(sumber, tujuan);
  console.log("pdf.js worker disalin ke public/pdf.worker.min.mjs");
} else {
  console.log("pdfjs-dist belum terpasang; worker dilewati");
}
