"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  }
  return (
    <button type="button" className="admin-logout-button" onClick={logout}>
      <LogOut className="h-4 w-4" />
      Đăng xuất
    </button>
  );
}
