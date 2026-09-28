import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";

import { TombolTema } from "@/components/theme-toggle";
import { teks } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import "./globals.css";

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
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          {teks.namaSitus}
        </Link>
        <TombolTema kunciTema={KUNCI_TEMA} />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 text-sm text-muted-foreground">
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
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
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
