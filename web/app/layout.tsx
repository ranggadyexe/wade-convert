import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wade Convert",
  description:
    "Toolkit konversi PDF dan gambar gratis. Sebagian besar diproses langsung di browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
