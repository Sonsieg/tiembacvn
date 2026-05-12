import type { Metadata } from "next";
import Image from "next/image";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import logoMark from "@/assets/thumnail.png";
import styles from "./login.module.css";

export const metadata: Metadata = { title: "Đăng nhập admin" };

export default function AdminLoginPage() {
  return (
    <div className={styles.page} style={{ height: "100vh", maxHeight: "100vh", overflow: "hidden" }}>
      <div className={styles.shell}>
        <div className={styles.visual}>
          <div className={styles.visualFrame} aria-hidden="true" />
          <div className={styles.visualBrand}>
            <Image src={logoMark} alt="" className={styles.visualLogo} priority style={{ width: "320px", height: "auto" }} />
          </div>
          <div className={styles.visualCopy}>
            <h2>Không gian quản trị tinh gọn, sang trọng.</h2>
            <div className={styles.divider}><span /></div>
            <p>Quản lý sản phẩm, đơn hàng, tồn kho, video review và SEO hiệu quả trong một không gian tinh tế.</p>
          </div>
        </div>
        <div className={styles.formWrap}>
          <AdminLoginForm styles={styles} />
        </div>
      </div>
    </div>
  );
}
