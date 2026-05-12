import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/constants/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Tiembac.vn — Trang sức bạc S925 cao cấp",
    template: "%s | Tiembac.vn",
  },
  description: siteConfig.description,
  openGraph: {
    title: "Tiembac.vn",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Tiembac.vn",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className="h-full scroll-smooth antialiased"
    >
      <body className="min-h-full bg-pearl text-ink">{children}</body>
    </html>
  );
}
