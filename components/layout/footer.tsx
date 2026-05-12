import Link from "next/link";
import { Camera, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { siteConfig } from "@/lib/constants/site";

export function Footer() {
  return (
    <footer className="bg-claret text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <h2 className="text-2xl font-semibold">Tiembac.vn</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">{siteConfig.description}</p>
          <div className="mt-5 flex gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><Camera className="h-4 w-4" /></span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><Share2 className="h-4 w-4" /></span>
          </div>
        </div>
        <FooterCol title="Mua sắm" links={[["Bộ sưu tập", "/collections"], ["Nhẫn bạc", "/collections/nhan-bac"], ["Quà tặng", "/collections/qua-tang"], ["Journal", "/journal"]]} />
        <FooterCol title="Hỗ trợ" links={[["Tra cứu đơn", "/track-order"], ["Vận chuyển", "/policy/chinh-sach-van-chuyen"], ["Đổi trả", "/policy/chinh-sach-doi-tra"], ["Bảo hành", "/policy/chinh-sach-bao-hanh"]]} />
        <div>
          <h3 className="font-semibold">Liên hệ</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/75">
            <span className="inline-flex gap-2"><Phone className="h-4 w-4" /> {siteConfig.phone}</span>
            <span className="inline-flex gap-2"><Mail className="h-4 w-4" /> {siteConfig.email}</span>
            <span className="inline-flex gap-2"><MapPin className="h-4 w-4" /> {siteConfig.address}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">© 2026 Tiembac.vn. Tất cả quyền được bảo lưu.</div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-4 grid gap-3 text-sm text-white/75">
        {links.map(([label, href]) => <Link key={href} href={href} className="hover:text-white">{label}</Link>)}
      </div>
    </div>
  );
}
