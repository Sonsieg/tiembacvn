import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/constants/site";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Tiembac.vn — Trang sức bạc S925 tối giản cao cấp",
    template: "%s | Tiembac.vn",
  },
  description: siteConfig.description,
  keywords: ["trang sức bạc", "bạc S925", "nhẫn bạc", "dây chuyền bạc", "vòng tay bạc", "khuyên tai bạc"],
  openGraph: {
    title: "Tiembac.vn — Trang sức bạc S925 tối giản cao cấp",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Tiembac.vn",
    locale: "vi_VN",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiembac.vn — Trang sức bạc S925 tối giản cao cấp",
    description: siteConfig.description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
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
      <body className="min-h-full bg-pearl text-ink">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
