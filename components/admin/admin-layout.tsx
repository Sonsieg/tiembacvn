"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Boxes, FolderTree, Gem, LayoutDashboard, Package, Percent, Settings, ShoppingBag, Store, Video } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import logoImage from "@/assets/thumnail.png";

const links = [
  ["Tổng quan", "/admin/dashboard", LayoutDashboard],
  ["Sản phẩm", "/admin/products", Gem],
  ["Đơn hàng", "/admin/orders", ShoppingBag],
  ["Tồn kho", "/admin/inventory", Boxes],
  ["Danh mục", "/admin/categories", FolderTree],
  ["Bộ sưu tập", "/admin/collections", Package],
  ["Mã giảm giá", "/admin/coupons", Percent],
  ["Video sản phẩm", "/admin/videos", Video],
  ["Blog SEO", "/admin/blog", BookOpen],
  ["Cài đặt", "/admin/settings", Settings],
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className={styles.adminRoot}>
      <aside className={styles.sidebar}>
        <Link href="/admin/dashboard" className={styles.brand} aria-label="Tiembac Admin">
          <Image src={logoImage} alt="Tiembac.vn" priority className={styles.brandLogo} />
        </Link>
        <nav className={styles.nav}>
          {links.map(([label, href, Icon]) => (
            <Link key={href as string} href={href as string} className={`${styles.navItem} ${pathname === href ? styles.navItemActive : ""}`}>
              <Icon className="h-4 w-4" /> {label as string}
            </Link>
          ))}
        </nav>
      </aside>
      <div className={styles.content}>
        <header className={styles.topbar}>
          <div className={styles.topbarInner}>
            <div><p className={styles.topbarEyebrow}>Trang quản trị</p><h1 className={styles.topbarTitle}>Bảng quản trị Tiembac.vn</h1></div>
            <div className={styles.topbarActions}>
              <Link href="/" className="flex items-center gap-2 rounded-sm border border-silver-200 bg-white px-3 py-2 text-sm font-medium text-navy shadow-sm">
                <Store className="h-4 w-4" />
                Quay lại cửa hàng
              </Link>
              <AdminLogoutButton />
            </div>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
