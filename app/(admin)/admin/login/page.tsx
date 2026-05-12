import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import styles from "./login.module.css";

export const metadata: Metadata = { title: "Đăng nhập admin" };

export default function AdminLoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.visual}>
          <div className={styles.visualBadge}>Tiembac.vn Admin</div>
          <div className={styles.visualCopy}>
            <h2>Quản trị trang sức bạc với một trải nghiệm thật gọn.</h2>
            <p>Theo dõi sản phẩm, đơn hàng, tồn kho, video review và nội dung SEO trong cùng một bảng điều khiển.</p>
          </div>
        </div>
        <div className={styles.formWrap}>
          <AdminLoginForm styles={styles} />
        </div>
      </div>
    </div>
  );
}
