import type { Metadata } from "next";
import Link from "next/link";

import { TombolTema } from "@/components/theme-toggle";
import { teks } from "@/lib/i18n";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Wade Convert",
  description:
    "Toolkit konversi PDF dan gambar gratis. Sebagian besar diproses langsung di browser.",
};

const KUNCI_TEMA = "wade-tema";

const SKRIP_TEMA = `try{const t=localStorage.getItem("${KUNCI_TEMA}");const d=t?t==="gelap":matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch{}`;

function Header() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {teks.namaSitus}
        </Link>
        <TombolTema kunciTema={KUNCI_TEMA} />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
        <p>{teks.footerCatatan}</p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className="flex min-h-dvh flex-col bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <script dangerouslySetInnerHTML={{ __html: SKRIP_TEMA }} />
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
