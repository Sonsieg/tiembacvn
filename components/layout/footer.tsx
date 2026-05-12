import Link from "next/link";
import { Camera, Mail, MapPin, Music2, Phone } from "lucide-react";
import { siteConfig } from "@/lib/constants/site";

export function Footer() {
  return (
    <footer className="border-t border-navy-soft bg-navy text-ivory">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.35fr_1fr_1fr_1fr]">
        <div>
          <h2 className="font-display text-4xl font-medium tracking-[.08em]">Tiembac.vn</h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-ivory/72">{siteConfig.description}</p>
          <div className="mt-5 flex gap-2">
            <a aria-label="Instagram" href="#" className="grid h-10 w-10 place-items-center rounded-sm border border-ivory/18 bg-white/5 text-cta transition hover:border-cta hover:bg-cta/10"><Camera className="h-4 w-4" /></a>
            <a aria-label="TikTok" href="#" className="grid h-10 w-10 place-items-center rounded-sm border border-ivory/18 bg-white/5 text-cta transition hover:border-cta hover:bg-cta/10"><Music2 className="h-4 w-4" /></a>
          </div>
        </div>
        <FooterCol title="Mua sắm" links={[["Bộ sưu tập", "/collections"], ["Nhẫn bạc", "/collections/nhan-bac"], ["Dây chuyền bạc", "/collections/day-chuyen-bac"], ["Cẩm nang", "/journal"]]} />
        <FooterCol title="Thương hiệu" links={[["Về Tiembac.vn", "/policy/about-us"], ["Câu hỏi thường gặp", "/policy/faq"], ["Chính sách vận chuyển", "/policy/chinh-sach-van-chuyen"], ["Đổi trả & bảo hành", "/policy/chinh-sach-doi-tra"]]} />
        <div>
          <h3 className="font-semibold">Liên hệ</h3>
          <div className="mt-4 grid gap-3 text-sm text-ivory/75">
            <span className="inline-flex gap-2"><Phone className="h-4 w-4" /> {siteConfig.phone}</span>
            <span className="inline-flex gap-2"><Mail className="h-4 w-4" /> {siteConfig.email}</span>
            <span className="inline-flex gap-2"><MapPin className="h-4 w-4" /> {siteConfig.address}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-ivory/58">© 2026 Tiembac.vn. Trang sức bạc S925 tinh tế cho mỗi ngày.</div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-4 grid gap-3 text-sm text-ivory/75">
        {links.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-cta">{label}</Link>)}
      </div>
    </div>
  );
}
